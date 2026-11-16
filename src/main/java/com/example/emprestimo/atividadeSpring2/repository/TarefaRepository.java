package com.example.emprestimo.atividadeSpring2.repository;

import com.example.emprestimo.atividadeSpring2.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
}
