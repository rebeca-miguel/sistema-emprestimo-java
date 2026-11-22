
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import API_URL from './api'
import type {
  Equipamento,
  Emprestimo,
  Colaborador,
  TipoEquipamento
} from './types'

type Tela =
    | 'dashboard'
    | 'equipamentos'
    | 'colaboradores'
    | 'emprestimos'

function obterDataISO(data: Date) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function obterDataFutura(dias: number) {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  return obterDataISO(data)
}

function App() {
  const [tela, setTela] = useState<Tela>('dashboard')

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [salvando, setSalvando] = useState(false)

  // Identificação dos registros em edição
  const [equipamentoEmEdicao, setEquipamentoEmEdicao] =
      useState<number | null>(null)

  const [colaboradorEmEdicao, setColaboradorEmEdicao] =
      useState<number | null>(null)

  // Dados do equipamento
  const [nome, setNome] = useState('')
  const [patrimonio, setPatrimonio] = useState('')
  const [tipo, setTipo] = useState<TipoEquipamento>('NOTEBOOK')

  // Dados do colaborador
  const [email, setEmail] = useState('')
  const [matricula, setMatricula] = useState('')

  // Dados do empréstimo
  const [equipamentoId, setEquipamentoId] = useState('')
  const [colaboradorId, setColaboradorId] = useState('')
  const [dataEmprestimo, setDataEmprestimo] =
      useState(obterDataISO(new Date()))
  const [dataPrevistaDevolucao, setDataPrevistaDevolucao] =
      useState(obterDataFutura(14))

  async function buscarDados() {
    try {
      setErro('')

      const [
        respostaEquipamentos,
        respostaEmprestimos,
        respostaColaboradores
      ] = await Promise.all([
        fetch(`${API_URL}/equipamentos`),
        fetch(`${API_URL}/emprestimos`),
        fetch(`${API_URL}/colaboradores`)
      ])

      if (
          !respostaEquipamentos.ok ||
          !respostaEmprestimos.ok ||
          !respostaColaboradores.ok
      ) {
        throw new Error('Não foi possível carregar os dados.')
      }

      const dadosEquipamentos: Equipamento[] =
          await respostaEquipamentos.json()

      const dadosEmprestimos: Emprestimo[] =
          await respostaEmprestimos.json()

      const dadosColaboradores: Colaborador[] =
          await respostaColaboradores.json()

      setEquipamentos(dadosEquipamentos)
      setEmprestimos(dadosEmprestimos)
      setColaboradores(dadosColaboradores)
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarDados()
  }, [])

  const totalEquipamentos = equipamentos.length

  const equipamentosDisponiveis = equipamentos.filter(
      (equipamento) => equipamento.disponivel
  ).length

  const emprestimosAtivos = emprestimos.filter(
      (emprestimo) => emprestimo.dataDevolucao === null
  ).length

  const hojeLocal = obterDataISO(new Date())

  function converterData(data: string) {
    const [ano, mes, dia] = data.split('-').map(Number)
    return new Date(ano, mes - 1, dia)
  }

  function formatarData(data: string) {
    return converterData(data).toLocaleDateString('pt-BR')
  }

  function obterSituacao(emprestimo: Emprestimo) {
    if (emprestimo.dataDevolucao !== null) {
      return 'Devolvido'
    }

    if (emprestimo.dataPrevistaDevolucao < hojeLocal) {
      return 'Em atraso'
    }

    return 'Ativo'
  }

  const emprestimosAtrasados = emprestimos.filter(
      (emprestimo) => obterSituacao(emprestimo) === 'Em atraso'
  ).length

  const emprestimosRecentes = [...emprestimos].sort(
      (a, b) => b.dataEmprestimo.localeCompare(a.dataEmprestimo)
  )

  const equipamentosDisponiveisLista = equipamentos.filter(
      (equipamento) => equipamento.disponivel
  )

  function limparMensagens() {
    setErro('')
    setSucesso('')
  }

  function limparFormularioEquipamento() {
    setNome('')
    setPatrimonio('')
    setTipo('NOTEBOOK')
    setEquipamentoEmEdicao(null)
  }

  function limparFormularioColaborador() {
    setNome('')
    setEmail('')
    setMatricula('')
    setColaboradorEmEdicao(null)
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    limparFormularioEquipamento()
    limparFormularioColaborador()
    limparMensagens()
  }

  function mudarTela(novaTela: Tela) {
    setTela(novaTela)
    setMostrarFormulario(false)
    limparFormularioEquipamento()
    limparFormularioColaborador()
    limparMensagens()
  }

  // Prepara o formulário para cadastrar um equipamento
  function novoEquipamento() {
    limparFormularioEquipamento()
    limparMensagens()
    setMostrarFormulario(true)
  }

  // Preenche o formulário com os dados do equipamento selecionado
  function editarEquipamento(equipamento: Equipamento) {
    limparMensagens()
    setNome(equipamento.nome)
    setPatrimonio(equipamento.patrimonio)
    setTipo(equipamento.tipo)
    setEquipamentoEmEdicao(equipamento.id)
    setMostrarFormulario(true)
  }

  async function cadastrarEquipamento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSalvando(true)
      limparMensagens()

      const editando = equipamentoEmEdicao !== null

      const resposta = await fetch(
          editando
              ? `${API_URL}/equipamentos/${equipamentoEmEdicao}`
              : `${API_URL}/equipamentos`,
          {
            method: editando ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nome,
              patrimonio,
              tipo
            })
          }
      )

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(
            mensagem ||
            (editando
                ? 'Não foi possível atualizar o equipamento.'
                : 'Não foi possível cadastrar o equipamento.')
        )
      }

      limparFormularioEquipamento()
      setMostrarFormulario(false)

      await buscarDados()

      setSucesso(
          editando
              ? 'Equipamento atualizado com sucesso!'
              : 'Equipamento cadastrado com sucesso!'
      )
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Erro ao salvar equipamento.'
      )
    } finally {
      setSalvando(false)
    }
  }

  async function excluirEquipamento(id: number) {
    const confirmar = window.confirm(
        'Tem certeza de que deseja excluir este equipamento?'
    )

    if (!confirmar) return

    try {
      setSalvando(true)
      limparMensagens()

      const resposta = await fetch(`${API_URL}/equipamentos/${id}`, {
        method: 'DELETE'
      })

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(
            mensagem || 'Não foi possível excluir o equipamento.'
        )
      }

      await buscarDados()
      setSucesso('Equipamento excluído com sucesso!')
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Erro ao excluir equipamento.'
      )
    } finally {
      setSalvando(false)
    }
  }

  // Prepara o formulário para cadastrar um colaborador
  function novoColaborador() {
    limparFormularioColaborador()
    limparMensagens()
    setMostrarFormulario(true)
  }

  // Preenche o formulário com os dados do colaborador selecionado
  function editarColaborador(colaborador: Colaborador) {
    limparMensagens()
    setNome(colaborador.nome)
    setEmail(colaborador.email)
    setMatricula(colaborador.matricula)
    setColaboradorEmEdicao(colaborador.id)
    setMostrarFormulario(true)
  }

  async function cadastrarColaborador(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSalvando(true)
      limparMensagens()

      const editando = colaboradorEmEdicao !== null

      const resposta = await fetch(
          editando
              ? `${API_URL}/colaboradores/${colaboradorEmEdicao}`
              : `${API_URL}/colaboradores`,
          {
            method: editando ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nome,
              email,
              matricula
            })
          }
      )

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(
            mensagem ||
            (editando
                ? 'Não foi possível atualizar o colaborador.'
                : 'Não foi possível cadastrar o colaborador.')
        )
      }

      limparFormularioColaborador()
      setMostrarFormulario(false)

      await buscarDados()

      setSucesso(
          editando
              ? 'Colaborador atualizado com sucesso!'
              : 'Colaborador cadastrado com sucesso!'
      )
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Erro ao salvar colaborador.'
      )
    } finally {
      setSalvando(false)
    }
  }

  async function excluirColaborador(id: number) {
    const confirmar = window.confirm(
        'Tem certeza de que deseja excluir este colaborador?'
    )

    if (!confirmar) return

    try {
      setSalvando(true)
      limparMensagens()

      const resposta = await fetch(`${API_URL}/colaboradores/${id}`, {
        method: 'DELETE'
      })

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(
            mensagem || 'Não foi possível excluir o colaborador.'
        )
      }

      await buscarDados()
      setSucesso('Colaborador excluído com sucesso!')
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Erro ao excluir colaborador.'
      )
    } finally {
      setSalvando(false)
    }
  }

  async function cadastrarEmprestimo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSalvando(true)
      limparMensagens()

      if (!equipamentoId || !colaboradorId) {
        throw new Error('Selecione um equipamento e um colaborador.')
      }

      if (dataEmprestimo < hojeLocal) {
        throw new Error(
            'A data do empréstimo não pode ser anterior à data atual.'
        )
      }

      if (dataPrevistaDevolucao < dataEmprestimo) {
        throw new Error(
            'A data prevista de devolução não pode ser anterior à data do empréstimo.'
        )
      }

      const resposta = await fetch(`${API_URL}/emprestimos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          equipamento: {
            id: Number(equipamentoId)
          },
          colaborador: {
            id: Number(colaboradorId)
          },
          dataEmprestimo,
          dataPrevistaDevolucao
        })
      })

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(
            mensagem || 'Não foi possível registrar o empréstimo.'
        )
      }

      setEquipamentoId('')
      setColaboradorId('')
      setDataEmprestimo(obterDataISO(new Date()))
      setDataPrevistaDevolucao(obterDataFutura(14))
      setMostrarFormulario(false)

      await buscarDados()
      setSucesso('Empréstimo registrado com sucesso!')
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Erro ao registrar empréstimo.'
      )
    } finally {
      setSalvando(false)
    }
  }

  async function devolverEmprestimo(id: number) {
    const confirmar = window.confirm(
        'Confirma a devolução deste equipamento?'
    )

    if (!confirmar) return

    try {
      setSalvando(true)
      limparMensagens()

      const resposta = await fetch(
          `${API_URL}/emprestimos/${id}/devolver`,
          { method: 'PUT' }
      )

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(
            mensagem || 'Não foi possível registrar a devolução.'
        )
      }

      await buscarDados()
      setSucesso('Devolução registrada com sucesso!')
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Erro ao registrar devolução.'
      )
    } finally {
      setSalvando(false)
    }
  }

  function abrirFormularioEmprestimo() {
    if (mostrarFormulario) {
      cancelarFormulario()
      return
    }

    setEquipamentoId('')
    setColaboradorId('')
    setDataEmprestimo(obterDataISO(new Date()))
    setDataPrevistaDevolucao(obterDataFutura(14))
    setMostrarFormulario(true)
    limparMensagens()
  }

  return (
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">C</div>
            <div>
              <h2>Controle de Equipamentos</h2>
              <span>Gestão e movimentação</span>
            </div>
          </div>

          <nav className="menu">
            <span className="menu-title">MENU PRINCIPAL</span>

            <button
                className={`menu-item ${tela === 'dashboard' ? 'active' : ''}`}
                onClick={() => mudarTela('dashboard')}
            >
              ▦ Dashboard
            </button>

            <button
                className={`menu-item ${tela === 'equipamentos' ? 'active' : ''}`}
                onClick={() => mudarTela('equipamentos')}
            >
              ▣ Equipamentos
            </button>

            <button
                className={`menu-item ${tela === 'colaboradores' ? 'active' : ''}`}
                onClick={() => mudarTela('colaboradores')}
            >
              ♙ Colaboradores
            </button>

            <button
                className={`menu-item ${tela === 'emprestimos' ? 'active' : ''}`}
                onClick={() => mudarTela('emprestimos')}
            >
              ⇄ Empréstimos
            </button>
          </nav>

          <div className="sidebar-footer">
            <span>Controle de Equipamentos</span>
            <small>Versão 1.0.0</small>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
            <span className="breadcrumb">
              Visão geral / {
              tela === 'dashboard'
                  ? 'Dashboard'
                  : tela === 'equipamentos'
                      ? 'Equipamentos'
                      : tela === 'colaboradores'
                          ? 'Colaboradores'
                          : 'Empréstimos'
            }
            </span>

              <h1>
                {tela === 'dashboard'
                    ? 'Dashboard'
                    : tela === 'equipamentos'
                        ? 'Equipamentos'
                        : tela === 'colaboradores'
                            ? 'Colaboradores'
                            : 'Empréstimos'}
              </h1>
            </div>

            <div className="user-info">
              <div className="avatar">A</div>
              <div>
                <strong>Administrador</strong>
                <small>Gestor do sistema</small>
              </div>
            </div>
          </header>

          {erro && (
              <p className="feedback-error" role="alert">{erro}</p>
          )}

          {sucesso && (
              <p className="feedback-success" role="status">{sucesso}</p>
          )}

          {tela === 'dashboard' && (
              <>
                <section className="welcome">
                  <div>
                    <h2>Bem-vindo ao Controle de Equipamentos!</h2>
                    <p>
                      Gerencie equipamentos, colaboradores e empréstimos em um só lugar.
                    </p>
                  </div>
                  <span className="welcome-icon">▣</span>
                </section>

                <section className="stats">
                  <article className="stat-card">
                    <div className="stat-icon blue">▣</div>
                    <span>Total de equipamentos</span>
                    <strong>{carregando ? '...' : totalEquipamentos}</strong>
                    <small>Equipamentos cadastrados</small>
                  </article>

                  <article className="stat-card">
                    <div className="stat-icon green">✓</div>
                    <span>Disponíveis</span>
                    <strong>{carregando ? '...' : equipamentosDisponiveis}</strong>
                    <small>Prontos para empréstimo</small>
                  </article>

                  <article className="stat-card">
                    <div className="stat-icon orange">⇄</div>
                    <span>Empréstimos ativos</span>
                    <strong>{carregando ? '...' : emprestimosAtivos}</strong>
                    <small>Equipamentos emprestados</small>
                  </article>

                  <article className="stat-card">
                    <div className="stat-icon red">!</div>
                    <span>Em atraso</span>
                    <strong>{carregando ? '...' : emprestimosAtrasados}</strong>
                    <small>Devoluções pendentes</small>
                  </article>
                </section>

                <section className="content-card">
                  <div className="section-header">
                    <div>
                      <h2>Empréstimos recentes</h2>
                      <p>Acompanhe as últimas movimentações.</p>
                    </div>
                    <span className="total-registros">
                  {emprestimos.length} registros
                </span>
                  </div>

                  {carregando ? (
                      <div className="empty-state">
                        <p>Carregando empréstimos...</p>
                      </div>
                  ) : emprestimosRecentes.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">▤</div>
                        <h3>Nenhum empréstimo cadastrado</h3>
                        <p>Os empréstimos cadastrados aparecerão nesta tabela.</p>
                      </div>
                  ) : (
                      <div className="table-container">
                        <table className="loans-table">
                          <thead>
                          <tr>
                            <th>Equipamento</th>
                            <th>Patrimônio</th>
                            <th>Colaborador</th>
                            <th>Empréstimo</th>
                            <th>Devolução prevista</th>
                            <th>Situação</th>
                          </tr>
                          </thead>
                          <tbody>
                          {emprestimosRecentes.map((emprestimo) => {
                            const situacao = obterSituacao(emprestimo)

                            return (
                                <tr key={emprestimo.id}>
                                  <td>{emprestimo.equipamento.nome}</td>
                                  <td>{emprestimo.equipamento.patrimonio}</td>
                                  <td>{emprestimo.colaborador.nome}</td>
                                  <td>{formatarData(emprestimo.dataEmprestimo)}</td>
                                  <td>{formatarData(emprestimo.dataPrevistaDevolucao)}</td>
                                  <td>
                              <span className={`status-badge ${situacao.toLowerCase().replace(' ', '-')}`}>
                                {situacao}
                              </span>
                                  </td>
                                </tr>
                            )
                          })}
                          </tbody>
                        </table>
                      </div>
                  )}
                </section>
              </>
          )}

          {/* EQUIPAMENTOS */}
          {tela === 'equipamentos' && (
              <section className="content-card">
                <div className="section-header">
                  <div>
                    <h2>Equipamentos cadastrados</h2>
                    <p>Consulte e acompanhe os equipamentos da empresa.</p>
                  </div>

                  <button
                      className="primary-button"
                      type="button"
                      disabled={salvando}
                      onClick={() => {
                        if (mostrarFormulario) {
                          cancelarFormulario()
                        } else {
                          novoEquipamento()
                        }
                      }}
                  >
                    {mostrarFormulario
                        ? 'Cancelar'
                        : '+ Novo equipamento'}
                  </button>
                </div>

                {mostrarFormulario && (
                    <form className="equipment-form" onSubmit={cadastrarEquipamento}>
                      <div className="form-field">
                        <label htmlFor="nomeEquipamento">Nome do equipamento</label>
                        <input
                            id="nomeEquipamento"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            placeholder="Ex.: Notebook Dell"
                            required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="patrimonio">Patrimônio</label>
                        <input
                            id="patrimonio"
                            value={patrimonio}
                            onChange={(event) => setPatrimonio(event.target.value)}
                            placeholder="Ex.: NOTE-001"
                            required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="tipo">Tipo</label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={(event) =>
                                setTipo(event.target.value as TipoEquipamento)
                            }
                        >
                          <option value="NOTEBOOK">Notebook</option>
                          <option value="MONITOR">Monitor</option>
                          <option value="HEADSET">Headset</option>
                        </select>
                      </div>

                      <div className="form-actions">
                        <button
                            className="primary-button"
                            type="submit"
                            disabled={salvando}
                        >
                          {salvando
                              ? 'Salvando...'
                              : equipamentoEmEdicao !== null
                                  ? 'Atualizar equipamento'
                                  : 'Salvar equipamento'}
                        </button>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={cancelarFormulario}
                            disabled={salvando}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                )}

                {carregando ? (
                    <div className="empty-state">
                      <p>Carregando equipamentos...</p>
                    </div>
                ) : equipamentos.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">▣</div>
                      <h3>Nenhum equipamento cadastrado</h3>
                      <p>Cadastre um equipamento para começar.</p>
                    </div>
                ) : (
                    <div className="table-container">
                      <table className="loans-table">
                        <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Patrimônio</th>
                          <th>Tipo</th>
                          <th>Disponibilidade</th>
                          <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipamentos.map((equipamento) => (
                            <tr key={equipamento.id}>
                              <td>{equipamento.nome}</td>
                              <td>{equipamento.patrimonio}</td>
                              <td>{equipamento.tipo}</td>
                              <td>
                          <span className={`status-badge ${equipamento.disponivel ? 'devolvido' : 'em-atraso'}`}>
                            {equipamento.disponivel ? 'Disponível' : 'Emprestado'}
                          </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                      className="edit-button"
                                      type="button"
                                      disabled={salvando}
                                      onClick={() => editarEquipamento(equipamento)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                      className="delete-button"
                                      type="button"
                                      disabled={salvando}
                                      onClick={() => excluirEquipamento(equipamento.id)}
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                )}
              </section>
          )}

          {/* COLABORADORES */}
          {tela === 'colaboradores' && (
              <section className="content-card">
                <div className="section-header">
                  <div>
                    <h2>Colaboradores cadastrados</h2>
                    <p>Consulte e gerencie os colaboradores da empresa.</p>
                  </div>

                  <button
                      className="primary-button"
                      type="button"
                      disabled={salvando}
                      onClick={() => {
                        if (mostrarFormulario) {
                          cancelarFormulario()
                        } else {
                          novoColaborador()
                        }
                      }}
                  >
                    {mostrarFormulario
                        ? 'Cancelar'
                        : '+ Novo colaborador'}
                  </button>
                </div>

                {mostrarFormulario && (
                    <form className="equipment-form" onSubmit={cadastrarColaborador}>
                      <div className="form-field">
                        <label htmlFor="nomeColaborador">Nome completo</label>
                        <input
                            id="nomeColaborador"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            placeholder="Ex.: Ana Souza"
                            required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Ex.: ana@email.com"
                            required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="matricula">Matrícula</label>
                        <input
                            id="matricula"
                            value={matricula}
                            onChange={(event) => setMatricula(event.target.value)}
                            placeholder="Ex.: COLAB-503"
                            required
                        />
                      </div>

                      <div className="form-actions">
                        <button
                            className="primary-button"
                            type="submit"
                            disabled={salvando}
                        >
                          {salvando
                              ? 'Salvando...'
                              : colaboradorEmEdicao !== null
                                  ? 'Atualizar colaborador'
                                  : 'Salvar colaborador'}
                        </button>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={cancelarFormulario}
                            disabled={salvando}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                )}

                {carregando ? (
                    <div className="empty-state">
                      <p>Carregando colaboradores...</p>
                    </div>
                ) : colaboradores.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">♙</div>
                      <h3>Nenhum colaborador cadastrado</h3>
                      <p>Cadastre um colaborador para começar.</p>
                    </div>
                ) : (
                    <div className="table-container">
                      <table className="loans-table">
                        <thead>
                        <tr>
                          <th>Nome</th>
                          <th>E-mail</th>
                          <th>Matrícula</th>
                          <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {colaboradores.map((colaborador) => (
                            <tr key={colaborador.id}>
                              <td>{colaborador.nome}</td>
                              <td>{colaborador.email}</td>
                              <td>{colaborador.matricula}</td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                      className="edit-button"
                                      type="button"
                                      disabled={salvando}
                                      onClick={() => editarColaborador(colaborador)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                      className="delete-button"
                                      type="button"
                                      disabled={salvando}
                                      onClick={() => excluirColaborador(colaborador.id)}
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                )}
              </section>
          )}

          {/* EMPRÉSTIMOS */}
          {tela === 'emprestimos' && (
              <section className="content-card">
                <div className="section-header">
                  <div>
                    <h2>Empréstimos registrados</h2>
                    <p>Registre retiradas e acompanhe as devoluções.</p>
                  </div>

                  <button
                      className="primary-button"
                      onClick={abrirFormularioEmprestimo}
                      type="button"
                  >
                    {mostrarFormulario ? 'Cancelar' : '+ Novo empréstimo'}
                  </button>
                </div>

                {mostrarFormulario && (
                    <form
                        className="equipment-form"
                        onSubmit={cadastrarEmprestimo}
                    >
                      <div className="form-field">
                        <label htmlFor="equipamentoId">Equipamento disponível</label>
                        <select
                            id="equipamentoId"
                            value={equipamentoId}
                            onChange={(event) => setEquipamentoId(event.target.value)}
                            required
                        >
                          <option value="">Selecione um equipamento</option>
                          {equipamentosDisponiveisLista.map((equipamento) => (
                              <option key={equipamento.id} value={equipamento.id}>
                                {equipamento.nome} - {equipamento.patrimonio}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label htmlFor="colaboradorId">Colaborador</label>
                        <select
                            id="colaboradorId"
                            value={colaboradorId}
                            onChange={(event) => setColaboradorId(event.target.value)}
                            required
                        >
                          <option value="">Selecione um colaborador</option>
                          {colaboradores.map((colaborador) => (
                              <option key={colaborador.id} value={colaborador.id}>
                                {colaborador.nome} - {colaborador.matricula}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label htmlFor="dataEmprestimo">Data do empréstimo</label>
                        <input
                            id="dataEmprestimo"
                            type="date"
                            value={dataEmprestimo}
                            min={hojeLocal}
                            onChange={(event) => {
                              const novaData = event.target.value
                              setDataEmprestimo(novaData)

                              if (dataPrevistaDevolucao < novaData) {
                                setDataPrevistaDevolucao(novaData)
                              }
                            }}
                            required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="dataPrevistaDevolucao">
                          Devolução prevista
                        </label>
                        <input
                            id="dataPrevistaDevolucao"
                            type="date"
                            value={dataPrevistaDevolucao}
                            min={dataEmprestimo}
                            onChange={(event) =>
                                setDataPrevistaDevolucao(event.target.value)
                            }
                            required
                        />
                      </div>

                      {equipamentosDisponiveisLista.length === 0 && (
                          <p className="feedback-error">
                            Não há equipamentos disponíveis para empréstimo.
                          </p>
                      )}

                      {colaboradores.length === 0 && (
                          <p className="feedback-error">
                            Cadastre um colaborador antes de registrar um empréstimo.
                          </p>
                      )}

                      <button
                          className="primary-button"
                          type="submit"
                          disabled={
                              salvando ||
                              equipamentosDisponiveisLista.length === 0 ||
                              colaboradores.length === 0
                          }
                      >
                        {salvando ? 'Registrando...' : 'Registrar empréstimo'}
                      </button>
                    </form>
                )}

                {carregando ? (
                    <div className="empty-state">
                      <p>Carregando empréstimos...</p>
                    </div>
                ) : emprestimosRecentes.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">⇄</div>
                      <h3>Nenhum empréstimo cadastrado</h3>
                      <p>Os empréstimos registrados aparecerão nesta tabela.</p>
                    </div>
                ) : (
                    <div className="table-container">
                      <table className="loans-table">
                        <thead>
                        <tr>
                          <th>Equipamento</th>
                          <th>Patrimônio</th>
                          <th>Colaborador</th>
                          <th>Retirada</th>
                          <th>Devolução prevista</th>
                          <th>Devolução realizada</th>
                          <th>Situação</th>
                          <th>Ação</th>
                        </tr>
                        </thead>
                        <tbody>
                        {emprestimosRecentes.map((emprestimo) => {
                          const situacao = obterSituacao(emprestimo)

                          return (
                              <tr key={emprestimo.id}>
                                <td>{emprestimo.equipamento.nome}</td>
                                <td>{emprestimo.equipamento.patrimonio}</td>
                                <td>{emprestimo.colaborador.nome}</td>
                                <td>{formatarData(emprestimo.dataEmprestimo)}</td>
                                <td>{formatarData(emprestimo.dataPrevistaDevolucao)}</td>
                                <td>
                                  {emprestimo.dataDevolucao
                                      ? formatarData(emprestimo.dataDevolucao)
                                      : '—'}
                                </td>
                                <td>
                            <span className={`status-badge ${situacao.toLowerCase().replace(' ', '-')}`}>
                              {situacao}
                            </span>
                                </td>
                                <td>
                                  {emprestimo.dataDevolucao === null ? (
                                      <button
                                          className="primary-button"
                                          type="button"
                                          disabled={salvando}
                                          onClick={() => devolverEmprestimo(emprestimo.id)}
                                      >
                                        Devolver
                                      </button>
                                  ) : (
                                      <span>Concluído</span>
                                  )}
                                </td>
                              </tr>
                          )
                        })}
                        </tbody>
                      </table>
                    </div>
                )}
              </section>
          )}
        </main>
      </div>
  )
}

export default App
