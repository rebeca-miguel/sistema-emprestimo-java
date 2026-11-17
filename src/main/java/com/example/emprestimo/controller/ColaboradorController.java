package com.example.emprestimo.controller;

import com.example.emprestimo.exception.NaoEncontradoException;
import com.example.emprestimo.model.Colaborador;
import com.example.emprestimo.service.ColaboradorService;
import jakarta.validation.Valid;
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
    public  Colaborador salvar(@RequestBody @Valid Colaborador colaborador) {
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
                .orElseThrow(() -> new NaoEncontradoException("Colaborador não encontrado"));
    }

    //excluir colaborador
    @DeleteMapping("/{id}")
    public  void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
