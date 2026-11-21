package com.example.emprestimo.service;

import com.example.emprestimo.exception.ConflitoException;
import com.example.emprestimo.exception.NaoEncontradoException;
import com.example.emprestimo.model.Colaborador;
import com.example.emprestimo.repository.ColaboradorRepository;
import com.example.emprestimo.repository.EmprestimoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColaboradorService {

    private final ColaboradorRepository repository;
    private final EmprestimoRepository emprestimoRepository;

    public ColaboradorService(ColaboradorRepository repository, EmprestimoRepository emprestimoRepository) {

        this.repository = repository;
        this.emprestimoRepository = emprestimoRepository;
    }

    public Colaborador salvar(Colaborador colaborador) {
        if (repository.existsByMatricula(colaborador.getMatricula())) {
            throw new ConflitoException("Matricula já cadastrada");
        }

        if (repository.existsByEmail(colaborador.getEmail())) {
            throw new ConflitoException("Email já cadastrado.");
        }


        return repository.save(colaborador);
    }

    public Colaborador atualizar(Long id, Colaborador dados) {
        Colaborador colaborador = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Colaborador não encontrado."));

        if (repository.existsByMatriculaAndIdNot(dados.getMatricula(), id)) {
            throw new ConflitoException("Matrícula já cadastrada");
        }

        if (repository.existsByEmailAndIdNot(dados.getEmail(), id)) {
            throw new ConflitoException("Email já cadastrado.");
        }

        colaborador.setNome((dados.getNome()));
        colaborador.setEmail((dados.getEmail()));
        colaborador.setMatricula((dados.getMatricula()));

        return repository.save(colaborador);
    }

    public List<Colaborador> listarTodos() {
        return repository.findAll();
    }

    public Optional<Colaborador> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void excluir(Long id) {
        Colaborador colaborador = repository.findById(id)
                        .orElseThrow(() -> new NaoEncontradoException("Colaborador não encontrado."));

        if (emprestimoRepository.existsByColaboradorId(id)) {

            throw new ConflitoException("Não é possível excluir um colaborador que possui empréstimos registrados.");
        }

        repository.deleteById(id);
    }

}
