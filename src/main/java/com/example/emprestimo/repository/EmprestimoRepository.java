package com.example.emprestimo.repository;

import com.example.emprestimo.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    boolean existsByColaboradorId(Long colaboradorId);

    boolean existsByEquipamentoIdAndDataDevolucaoIsNull(Long equipamentoId);

    boolean existsByEquipamentoId(Long equipamento);

    Object findById(long l);
}
