package dev.Proffice.Proffice.model;

import jakarta.persistence.*;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCurso;

    private String nome;
    private String descricao;
    private int cargaHoraria;
    private String modalidade;
    private String coordenador;

    @OneToMany(mappedBy = "curso")
    private List<Turma> turmas;
}
