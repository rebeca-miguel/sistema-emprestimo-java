package com.example.emprestimo.atividadeSpring1.controller;


import com.example.emprestimo.atividadeSpring1.model.Recado;
import com.example.emprestimo.atividadeSpring1.service.RecadoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recados")
public class RecadoController {

    private final RecadoService service;

    public RecadoController(RecadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Recado> listar() {
        return service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Recado cadastrar(@RequestBody Recado recado){
        return service.cadastrar(recado);
    }

}
