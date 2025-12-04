package dev.Proffice.Proffice.controller;

import dev.Proffice.Proffice.model.Turma;
import dev.Proffice.Proffice.repository.TurmaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@CrossOrigin(origins = "http://localhost:5173")
public class TurmaController {

    private final TurmaRepository repository;

    public TurmaController(TurmaRepository repository) {
        this.repository = repository;
    }

    // LISTAR TODOS
    @GetMapping
    public List<Turma> listar() {
        return repository.findAll();
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public Turma buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    // CRIAR TURMA
    @PostMapping
    public Turma criar(@RequestBody Turma turma) {
        return repository.save(turma);
    }

    // ATUALIZAR TURMA
    @PutMapping("/{id}")
    public Turma atualizar(@PathVariable Long id, @RequestBody Turma nova) {
        Turma turma = repository.findById(id).orElseThrow();

        turma.setCodigo(nova.getCodigo());
        turma.setTurno(nova.getTurno());
        turma.setAnoLetivo(nova.getAnoLetivo());
        turma.setSala(nova.getSala());
        turma.setStatus(nova.getStatus());
        turma.setCurso(nova.getCurso());

        return repository.save(turma);
    }

    // DELETAR TURMA
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
