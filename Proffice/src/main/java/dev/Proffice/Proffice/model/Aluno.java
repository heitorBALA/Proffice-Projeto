package dev.Proffice.Proffice.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private LocalDate dataNascimento;
    private String cpf;
    private String email;
    private String telefone;
    private String endereco;
    private LocalDate dataMatricula;
    private String status;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;
}