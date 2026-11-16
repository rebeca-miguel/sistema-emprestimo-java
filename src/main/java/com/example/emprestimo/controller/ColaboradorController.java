package com.example.emprestimo.controller;

import com.example.emprestimo.model.Colaborador;
import com.example.emprestimo.service.ColaboradorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/colaboradores")
public class ColaboradorController {

    private final ColaboradorService service;

    public ColaboradorController(ColaboradorService service) {
        this.service = service;
    }
//cadastrar colaboradores
    @PostMapping
    public  Colaborador salvar(@RequestBody Colaborador colaborador) {
        return service.salvar(colaborador);
    }

    //listar todos os colabores
    @GetMapping
    public List<Colaborador> listarTodos() {
        return service.listarTodos();
    }
//buscar por ID
    @GetMapping("/{id}")
    public Colaborador buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Colaborador não encontrado"));
    }

    //excluir colaborador
    @DeleteMapping
    public  void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
