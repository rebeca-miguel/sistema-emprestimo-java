package com.example.emprestimo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O equipamento é obrigatório")
    @ManyToOne
    @JoinColumn(name = "equipamento_id")
    private Equipamento equipamento;

    @NotNull(message = "O colaborador é obrigatório")
    @ManyToOne
    @JoinColumn(name = "colaborador_id")
    private Colaborador colaborador;

    @NotNull(message = "A data do empréstimo é obrigatória")
    @FutureOrPresent(message = "A data do empréstimo não pode ser anterior à data atual")
    private LocalDate dataEmprestimo;

    @NotNull(message = "A data prevista de devolução é obrigatória")
    private LocalDate dataPrevistaDevolucao;

    private LocalDate dataDevolucao;

    public Emprestimo(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Equipamento getEquipamento() {
        return equipamento;
    }

    public void setEquipamento(Equipamento equipamento) {
        this.equipamento = equipamento;
    }

    public Colaborador getColaborador() {
        return colaborador;
    }

    public void setColaborador(Colaborador colaborador) {
        this.colaborador = colaborador;
    }

    public LocalDate getDataEmprestimo() {
        return dataEmprestimo;
    }

    public void setDataEmprestimo(LocalDate dataEmprestimo) {
        this.dataEmprestimo = dataEmprestimo;
    }

    public LocalDate getDataPrevistaDevolucao() {
        return dataPrevistaDevolucao;
    }

    public void setDataPrevistaDevolucao(LocalDate dataPrevistaDevolucao) {
        this.dataPrevistaDevolucao = dataPrevistaDevolucao;
    }

    public LocalDate getDataDevolucao() {
        return dataDevolucao;
    }

    public void setDataDevolucao(LocalDate dataDevolucao) {

        this.dataDevolucao = dataDevolucao;
    }

    public void devolver(LocalDate data) {
        if (dataDevolucao != null) {
            throw new IllegalArgumentException("Este empréstimo já foi devolvido.");
        }

        dataDevolucao = data;
    }

    public boolean estaAtrasadoEm(LocalDate data) {
        return dataDevolucao == null && data.isAfter(dataPrevistaDevolucao);
    }
}
