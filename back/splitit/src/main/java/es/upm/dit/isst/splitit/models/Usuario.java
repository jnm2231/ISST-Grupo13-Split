package es.upm.dit.isst.splitit.models;

import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "nombre")
public class Usuario {

    @Id
    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String contraseña;

    @OneToMany(mappedBy = "usuario")
    private List<UsuarioGrupo> grupos; // Grupos en los que está

    // Constructores
    public Usuario() {}

    /**
     * Constructor con parámetros.
     * @param nombre
     * @param email
     * @param contraseña
     */
    public Usuario(String nombre, String email, String contraseña) {
        this.nombre = nombre;
        this.email = email;
        this.contraseña = contraseña;
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public List<UsuarioGrupo> getGrupos() {
        return grupos;
    }

    public void setGrupos(List<UsuarioGrupo> grupos) {
        this.grupos = grupos;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Usuario)) return false;
        Usuario usuario = (Usuario) o;
        return nombre.equals(usuario.nombre) && email.equals(usuario.email) && contraseña.equals(usuario.contraseña);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre);
    }
}

