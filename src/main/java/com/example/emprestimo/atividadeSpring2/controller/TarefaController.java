package com.example.emprestimo.atividadeSpring2.controller;

import com.example.emprestimo.atividadeSpring2.model.Tarefa;
import com.example.emprestimo.atividadeSpring2.service.TarefaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    private final TarefaService tarefaService;

    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @GetMapping
    public List<Tarefa> listarTarefa() {
        return tarefaService.listarTarefas();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tarefa cadastrarTarefa(@RequestBody Tarefa tarefa) {
        return tarefaService.cadastrarTarefa(tarefa);
    }
}
