package com.example.emprestimo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Equipamento {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotBlank(message = "O patrimônio é obrigatório")
        private String patrimonio;

        @NotBlank(message = "O nome do equipamento é obrigatório")
        private String nome;

        @NotNull(message = "O tipo do equipamento é obrigatório")
        @Enumerated(EnumType.STRING)
        private TipoEquipamento tipo;

        private boolean disponivel;

        public Equipamento() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatrimonio() {
        return patrimonio;
    }

    public void setPatrimonio(String patrimonio) {
        this.patrimonio = patrimonio;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoEquipamento getTipo() {
        return tipo;
    }

    public void setTipo(TipoEquipamento tipo) {
        this.tipo = tipo;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    //Regra R4: para emprestar equipamento

    public void emprestar() {
            if (!disponivel) {
                throw new IllegalArgumentException("Equipamento indisponível");
            }
            disponivel = false;
    }

    //regra devolver
    public void devolver() {
            disponivel = true;
    }
}