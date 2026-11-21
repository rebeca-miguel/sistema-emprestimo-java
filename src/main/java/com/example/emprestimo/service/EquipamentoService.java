package com.example.emprestimo.service;

import com.example.emprestimo.exception.ConflitoException;
import com.example.emprestimo.exception.NaoEncontradoException;
import com.example.emprestimo.model.Equipamento;
import com.example.emprestimo.model.TipoEquipamento;
import com.example.emprestimo.repository.EmprestimoRepository;
import com.example.emprestimo.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipamentoService {

    private final EquipamentoRepository repository;
    private final EmprestimoRepository emprestimoRepository;


    //injetando as dependncias

    public EquipamentoService(EquipamentoRepository repository, EmprestimoRepository emprestimoRepository) {
        this.repository = repository;
        this.emprestimoRepository = emprestimoRepository;
    }

    //filtros e listas de equipamentos

    public List<Equipamento> listar(TipoEquipamento tipo, Boolean disponivel) {
        if (tipo != null &&  disponivel != null) {
            return repository.findByTipoAndDisponivel(tipo, disponivel);
        }
        if (tipo != null) {
            return repository.findByTipo(tipo);
        }
        if (disponivel != null) {
            return repository.findByDisponivel(disponivel);
        }
        return repository.findAll();
    }

    //buscar pelo id
    public Equipamento buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NaoEncontradoException("Equipamento não encontrado"));



    }

    //cadastrar equipamento r1 r2
    public Equipamento cadastrar(Equipamento equipamento) {
        if (repository.existsByPatrimonio(equipamento.getPatrimonio())) {
            throw  new ConflitoException("Patrimônio já cadastrado");
        }

        // r2: todo equipamento novo nasce disponivel
        equipamento.setDisponivel(true);

        return repository.save(equipamento);
    }

    //atualizar equipamento
    public Equipamento atualizar(Long id, Equipamento dados) {
        Equipamento equipamento = buscar(id);
        if (emprestimoRepository.existsByEquipamentoIdAndDataDevolucaoIsNull(id)) {
            throw new ConflitoException("Não é possível atualizar um equipamento que possui empréstimo ativo.");
        }
        if (repository.existsByPatrimonioAndIdNot(
                dados.getPatrimonio(), id)) {
            throw new ConflitoException("Patrimonio já cadastrado");
        }

        equipamento.setNome((dados.getNome()));
        equipamento.setPatrimonio(dados.getPatrimonio());
        equipamento.setTipo(dados.getTipo());

        return repository.save(equipamento);
    }

    public void excluir(Long id) {
        Equipamento equipamento = buscar(id);

        if (emprestimoRepository.existsByEquipamentoId(id)){
            throw new ConflitoException("Não é possível excluir um equipamento que possui empréstimos registrados.");
        }

        repository.delete(equipamento);
    }



}
