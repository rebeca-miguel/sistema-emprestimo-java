
package com.example.emprestimo.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class EmprestimoTest {

    @Test
    void deveRegistrarDataDeDevolucao() {
        Emprestimo emprestimo = new Emprestimo();
        LocalDate data = LocalDate.of(2026, 11, 21);

        emprestimo.devolver(data);

        assertEquals(data, emprestimo.getDataDevolucao());
    }

    @Test
    void naoDevePermitirDevolucaoDuasVezes() {
        Emprestimo emprestimo = new Emprestimo();

        emprestimo.devolver(LocalDate.of(2026, 11, 21));

        assertThrows(IllegalArgumentException.class,
                () -> emprestimo.devolver(LocalDate.of(2026, 11, 22)));
    }

    @Test
    void deveIdentificarEmprestimoAtrasado() {
        Emprestimo emprestimo = criarEmprestimoComPrazo(
                LocalDate.of(2026, 11, 20));

        assertTrue(emprestimo.estaAtrasadoEm(
                LocalDate.of(2026, 11, 21)));
    }

    @Test
    void naoDeveConsiderarAtrasadoNoDiaDoPrazo() {
        Emprestimo emprestimo = criarEmprestimoComPrazo(
                LocalDate.of(2026, 11, 21));

        assertFalse(emprestimo.estaAtrasadoEm(
                LocalDate.of(2026, 11, 21)));
    }

    @Test
    void naoDeveConsiderarAtrasadoAntesDoPrazo() {
        Emprestimo emprestimo = criarEmprestimoComPrazo(
                LocalDate.of(2026, 11, 22));

        assertFalse(emprestimo.estaAtrasadoEm(
                LocalDate.of(2026, 11, 21)));
    }

    @Test
    void naoDeveConsiderarAtrasadoQuandoJaFoiDevolvido() {
        Emprestimo emprestimo = criarEmprestimoComPrazo(
                LocalDate.of(2026, 11, 20));

        emprestimo.devolver(LocalDate.of(2026, 11, 21));

        assertFalse(emprestimo.estaAtrasadoEm(
                LocalDate.of(2026, 11, 22)));
    }

    @Test
    void naoDeveConsiderarAtrasadoQuandoDevolvidoNoPrazo() {
        Emprestimo emprestimo = criarEmprestimoComPrazo(
                LocalDate.of(2026, 11, 21));

        emprestimo.devolver(LocalDate.of(2026, 11, 21));

        assertFalse(emprestimo.estaAtrasadoEm(
                LocalDate.of(2026, 11, 22)));
    }

    private Emprestimo criarEmprestimoComPrazo(LocalDate prazo) {
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setDataEmprestimo(LocalDate.of(2026, 11, 20));
        emprestimo.setDataPrevistaDevolucao(prazo);
        return emprestimo;
    }
}
