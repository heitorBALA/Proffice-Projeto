package dev.Proffice.Proffice.controller;

import dev.Proffice.Proffice.model.Aluno;
import dev.Proffice.Proffice.repository.AlunoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = "http://localhost:5173")
public class AlunoController {

    private final AlunoRepository repository;

    public AlunoController(AlunoRepository repository) {
        this.repository = repository;
    }

    // LISTAR TODOS
    @GetMapping
    public List<Aluno> listar() {
        return repository.findAll();
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public Aluno buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    // CRIAR NOVO ALUNO
    @PostMapping
    public Aluno criar(@RequestBody Aluno aluno) {
        return repository.save(aluno);
    }

    // ATUALIZAR ALUNO
    @PutMapping("/{id}")
    public Aluno atualizar(@PathVariable Long id, @RequestBody Aluno novo) {
        Aluno aluno = repository.findById(id).orElseThrow();

        aluno.setNome(novo.getNome());
        aluno.setDataNascimento(novo.getDataNascimento());
        aluno.setCpf(novo.getCpf());
        aluno.setEmail(novo.getEmail());
        aluno.setTelefone(novo.getTelefone());
        aluno.setEndereco(novo.getEndereco());
        aluno.setDataMatricula(novo.getDataMatricula());
        aluno.setStatus(novo.getStatus());
        aluno.setTurma(novo.getTurma());

        return repository.save(aluno);
    }

    // DELETAR ALUNO
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

