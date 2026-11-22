
export type TipoEquipamento = 'NOTEBOOK' | 'MONITOR' | 'HEADSET'

export interface Equipamento {
    id: number
    patrimonio: string
    nome: string
    tipo: TipoEquipamento
    disponivel: boolean
}


export interface Colaborador {
    id: number
    nome: string
    email: string
    matricula: string
}


export interface Emprestimo {
    id: number
    equipamento: Equipamento
    colaborador: Colaborador
    dataEmprestimo: string
    dataPrevistaDevolucao: string
    dataDevolucao: string | null
}


