package com.example.emprestimo.model;


import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EquipamentoTest {

    @Test
    void deveEmprestarEquipamentoDisponivel() {

        Equipamento equipamento = new Equipamento();
        equipamento.setDisponivel(true);

        equipamento.emprestar();

        assertFalse(equipamento.isDisponivel());
    }

    @Test
    void deveImpedirEmprestimoDeEquipamentoIndisponivel() {

        Equipamento equipamento = new Equipamento();
        equipamento.setDisponivel(false);

        assertThrows(
                IllegalArgumentException.class,
                () -> equipamento.emprestar()
        );

        assertFalse(equipamento.isDisponivel());
    }

    @Test
    void deveDevolverEquipamento() {

        Equipamento equipamento = new Equipamento();
        equipamento.setDisponivel(false);

        equipamento.devolver();

        assertTrue(equipamento.isDisponivel());
    }
}

