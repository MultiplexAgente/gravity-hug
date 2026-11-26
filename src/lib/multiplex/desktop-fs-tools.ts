/**
 * HUG Desktop Agent — Ferramentas de Sistema de Arquivos do Windows (Desktop FS Tools)
 * 
 * Permite à I.A interagir diretamente com o sistema operacional:
 * 1. Buscar arquivos no PC (retorna o caminho exato onde o arquivo está)
 * 2. Criar novas pastas e diretórios
 * 3. Mover e renomear arquivos/pastas
 * 4. Listar conteúdos de diretórios
 * 5. Ler prévias de arquivos de texto/documentos
 */

import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export interface ResultadoArquivo {
  nome: string;
  caminhoCompleto: string;
  tamanhoBytes: number;
  tamanhoFormatado: string;
  eDiretorio: boolean;
  modificadoEm: string;
}

export interface RespostaOperacaoFS {
  sucesso: boolean;
  mensagem: string;
  acao: "buscar" | "criar_pasta" | "mover" | "listar" | "ler";
  dados?: any;
  erro?: string;
}

function formatarTamanho(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export class DesktopFSTools {
  /**
   * 1. Busca arquivos no PC pelo nome ou termo (BFS ultra-rápido nativo em Node.js com profundidade controlada)
   */
  public static async buscarArquivos(
    termo: string,
    diretorioInicial?: string,
    limite: number = 20
  ): Promise<RespostaOperacaoFS> {
    try {
      const termoLimpo = termo.trim();
      if (!termoLimpo) {
        return {
          sucesso: false,
          acao: "buscar",
          mensagem: "Termo de busca não fornecido.",
        };
      }

      const termoLower = termoLimpo.toLowerCase();

      // Diretório base
      let dirBase = diretorioInicial ? path.resolve(diretorioInicial) : "D:\\Desenvolvimento";
      if (!fs.existsSync(dirBase)) {
        dirBase = "D:\\";
        if (!fs.existsSync(dirBase)) {
          dirBase = process.env.USERPROFILE || "C:\\Users";
        }
      }

      const encontrados: ResultadoArquivo[] = [];
      const filaDiretorios: { dir: string; profundidade: number }[] = [{ dir: dirBase, profundidade: 0 }];
      const maxProfundidade = 4;
      const maxDiretoriosExaminados = 200;
      let diretoriosExaminados = 0;
      const pastasIgnoradas = new Set([
        "node_modules",
        ".git",
        ".output",
        "dist",
        ".cache",
        ".tanstack",
        ".next",
        "$RECYCLE.BIN",
        "System Volume Information",
      ]);

      while (filaDiretorios.length > 0 && encontrados.length < limite && diretoriosExaminados < maxDiretoriosExaminados) {
        const itemAtual = filaDiretorios.shift();
        if (!itemAtual || itemAtual.profundidade > maxProfundidade) continue;

        diretoriosExaminados++;

        try {
          const entradas = fs.readdirSync(itemAtual.dir, { withFileTypes: true });

          for (const ent of entradas) {
            const nome = ent.name;
            if (pastasIgnoradas.has(nome)) continue;

            const fullPath = path.join(itemAtual.dir, nome);

            if (nome.toLowerCase().includes(termoLower)) {
              let tamanho = 0;
              let modificado = "";
              try {
                const s = fs.statSync(fullPath);
                tamanho = s.size;
                modificado = s.mtime.toISOString().replace("T", " ").substring(0, 19);
              } catch {}

              encontrados.push({
                nome,
                caminhoCompleto: fullPath,
                tamanhoBytes: tamanho,
                tamanhoFormatado: formatarTamanho(tamanho),
                eDiretorio: ent.isDirectory(),
                modificadoEm: modificado,
              });

              if (encontrados.length >= limite) break;
            }

            if (ent.isDirectory() && itemAtual.profundidade < maxProfundidade) {
              filaDiretorios.push({ dir: fullPath, profundidade: itemAtual.profundidade + 1 });
            }
          }
        } catch {
          // Ignora erros de permissão em pastas do sistema
        }
      }

      return {
        sucesso: true,
        acao: "buscar",
        mensagem: encontrados.length > 0
          ? `Foram encontrados ${encontrados.length} arquivo(s)/pasta(s) correspondente(s) a "${termoLimpo}".`
          : `Nenhum arquivo ou pasta com o termo "${termoLimpo}" foi encontrado em ${dirBase}.`,
        dados: encontrados,
      };
    } catch (err: any) {
      return {
        sucesso: false,
        acao: "buscar",
        mensagem: `Erro ao buscar arquivos no Windows: ${err?.message}`,
        erro: err?.message,
      };
    }
  }

  /**
   * 2. Cria uma nova pasta no disco
   */
  public static async criarPasta(caminhoPasta: string): Promise<RespostaOperacaoFS> {
    try {
      const pastaDestino = path.resolve(caminhoPasta);

      // Previne criação em caminhos críticos do sistema operacional
      if (/^[a-zA-Z]:\\Windows\\/i.test(pastaDestino) || /^[a-zA-Z]:\\Program Files/i.test(pastaDestino)) {
        return {
          sucesso: false,
          acao: "criar_pasta",
          mensagem: "Operação bloqueada: não é permitido criar pastas em diretórios protegidos do sistema operacional.",
        };
      }

      if (fs.existsSync(pastaDestino)) {
        return {
          sucesso: true,
          acao: "criar_pasta",
          mensagem: `A pasta já existia: ${pastaDestino}`,
          dados: { caminho: pastaDestino, jaExistia: true },
        };
      }

      fs.mkdirSync(pastaDestino, { recursive: true });

      return {
        sucesso: true,
        acao: "criar_pasta",
        mensagem: `Pasta criada com sucesso no Windows em: ${pastaDestino}`,
        dados: { caminho: pastaDestino, criado: true },
      };
    } catch (err: any) {
      return {
        sucesso: false,
        acao: "criar_pasta",
        mensagem: `Erro ao criar pasta: ${err?.message}`,
        erro: err?.message,
      };
    }
  }

  /**
   * 3. Move ou renomeia arquivos e pastas
   */
  public static async moverArquivo(origem: string, destino: string): Promise<RespostaOperacaoFS> {
    try {
      const pathOrigem = path.resolve(origem);
      let pathDestino = path.resolve(destino);

      if (!fs.existsSync(pathOrigem)) {
        return {
          sucesso: false,
          acao: "mover",
          mensagem: `Arquivo ou pasta de origem não encontrado: ${pathOrigem}`,
        };
      }

      // Se o destino for uma pasta existente, move para dentro dela mantendo o nome do arquivo
      if (fs.existsSync(pathDestino) && fs.statSync(pathDestino).isDirectory()) {
        pathDestino = path.join(pathDestino, path.basename(pathOrigem));
      }

      // Garante que o diretório pai do destino exista
      const dirPai = path.dirname(pathDestino);
      if (!fs.existsSync(dirPai)) {
        fs.mkdirSync(dirPai, { recursive: true });
      }

      // Tenta mover atomicamente ou copiar+deletar se entre unidades de disco diferentes
      try {
        fs.renameSync(pathOrigem, pathDestino);
      } catch (renameErr: any) {
        if (renameErr.code === "EXDEV") {
          // Cross-device link (ex: do C: para o D:)
          fs.copyFileSync(pathOrigem, pathDestino);
          fs.unlinkSync(pathOrigem);
        } else {
          throw renameErr;
        }
      }

      return {
        sucesso: true,
        acao: "mover",
        mensagem: `Arquivo movido com sucesso para: ${pathDestino}`,
        dados: {
          origem: pathOrigem,
          destino: pathDestino,
        },
      };
    } catch (err: any) {
      return {
        sucesso: false,
        acao: "mover",
        mensagem: `Erro ao mover arquivo: ${err?.message}`,
        erro: err?.message,
      };
    }
  }

  /**
   * 4. Lista arquivos e pastas de um diretório
   */
  public static async listarDiretorio(caminhoDiretorio: string): Promise<RespostaOperacaoFS> {
    try {
      const dirAlvo = path.resolve(caminhoDiretorio);
      if (!fs.existsSync(dirAlvo)) {
        return {
          sucesso: false,
          acao: "listar",
          mensagem: `Diretório não encontrado: ${dirAlvo}`,
        };
      }

      const itens = fs.readdirSync(dirAlvo, { withFileTypes: true });
      const resultado: ResultadoArquivo[] = itens.slice(0, 50).map((item) => {
        const full = path.join(dirAlvo, item.name);
        let tamanho = 0;
        let modificado = "";
        try {
          const stats = fs.statSync(full);
          tamanho = stats.size;
          modificado = stats.mtime.toISOString();
        } catch {}

        return {
          nome: item.name,
          caminhoCompleto: full,
          tamanhoBytes: tamanho,
          tamanhoFormatado: formatarTamanho(tamanho),
          eDiretorio: item.isDirectory(),
          modificadoEm: modificado,
        };
      });

      return {
        sucesso: true,
        acao: "listar",
        mensagem: `Listagem concluída para ${dirAlvo} (${resultado.length} itens).`,
        dados: {
          diretorio: dirAlvo,
          itens: resultado,
        },
      };
    } catch (err: any) {
      return {
        sucesso: false,
        acao: "listar",
        mensagem: `Erro ao listar diretório: ${err?.message}`,
        erro: err?.message,
      };
    }
  }

  /**
   * 5. Lê o conteúdo de um arquivo de texto
   */
  public static async lerArquivo(caminhoArquivo: string, maxLinhas: number = 200): Promise<RespostaOperacaoFS> {
    try {
      const arq = path.resolve(caminhoArquivo);
      if (!fs.existsSync(arq) || fs.statSync(arq).isDirectory()) {
        return {
          sucesso: false,
          acao: "ler",
          mensagem: `Arquivo não encontrado ou é um diretório: ${arq}`,
        };
      }

      const conteudo = fs.readFileSync(arq, "utf-8");
      const linhas = conteudo.split("\n").slice(0, maxLinhas).join("\n");

      return {
        sucesso: true,
        acao: "ler",
        mensagem: `Leitura concluída (${linhas.length} caracteres).`,
        dados: {
          caminho: arq,
          conteudo: linhas,
        },
      };
    } catch (err: any) {
      return {
        sucesso: false,
        acao: "ler",
        mensagem: `Erro ao ler arquivo: ${err?.message}`,
        erro: err?.message,
      };
    }
  }

  /**
   * 6. Analisador Inteligente de Comandos de Arquivos do Usuário
   * Detecta se a mensagem do usuário pede para buscar, criar pasta, mover arquivo, etc.
   */
  public static async processarComandoInteligente(mensagem: string): Promise<RespostaOperacaoFS | null> {
    const msg = (mensagem || "").trim();

    // A. Busca de Arquivo ("onde está o arquivo X", "encontre o arquivo X", "busque o arquivo X")
    const matchBusca = msg.match(
      /(?:onde\s+(?:est[aá]|fica)|encontr(?:e|ar)|busqu(?:e|ar)|ach(?:e|ar)|procur(?:e|ar))\s+(?:o\s+)?(?:arquivo|pasta|documento|foto|planilha)?\s*[:"']?([a-zA-Z0-9_\-.\s]+\.[a-zA-Z0-9]{2,5}|[a-zA-Z0-9_\-\s]{3,})/i
    );
    if (matchBusca && matchBusca[1]) {
      const termo = matchBusca[1].replace(/["']/g, "").trim();
      if (termo.length >= 3 && !/^(onde|como|qual|quem|quando)$/i.test(termo)) {
        return await this.buscarArquivos(termo);
      }
    }

    // B. Criação de Pasta ("crie uma pasta chamada X", "criar pasta X")
    const matchCriar = msg.match(
      /(?:cri(?:e|ar)|nova\s+pasta)\s+(?:uma\s+pasta\s+(?:chamada\s+)?)?[:"']?([a-zA-Z0-9_\-:\\/.\s]+)/i
    );
    if (matchCriar && matchCriar[1] && (msg.toLowerCase().includes("pasta") || msg.toLowerCase().includes("diretorio"))) {
      let alvo = matchCriar[1].replace(/["']/g, "").trim();
      if (!/^[a-zA-Z]:\\/i.test(alvo)) {
        alvo = path.join("D:\\Desenvolvimento", alvo);
      }
      return await this.criarPasta(alvo);
    }

    // C. Mover Arquivo ("mova o arquivo X para a pasta Y")
    const matchMover = msg.match(
      /(?:mov(?:a|er)|transfer(?:ir|e))\s+(?:o\s+arquivo\s+)?["']?([^"']+)["']?\s+para\s+["']?([^"']+)["']?/i
    );
    if (matchMover && matchMover[1] && matchMover[2]) {
      return await this.moverArquivo(matchMover[1].trim(), matchMover[2].trim());
    }

    return null;
  }
}
