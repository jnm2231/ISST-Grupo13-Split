package es.upm.dit.isst.splitit.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(nullable = true)
    @JsonIgnore
    private String password; // Contraseña del usuario, permitimos que sea nula para usuarios de Google

    @Column(name= "authprovider", nullable = false)
    private String authProvider; // local o google

    // @Column(name= "GoogleToken", nullable = true)
    // private String googleToken; // Token de Google, se puede usar para verificar la autenticidad del usuario

    @OneToMany(mappedBy = "usuario")
    private List<UsuarioGrupo> grupos; // Grupos en los que está

    // Constructores
    public Usuario() {}

    /**
     * Constructor con parámetros.
     * @param nombre
     * @param email
     * @param password
     * @param authProvider
     */
    public Usuario(String nombre, String email, String password, String authProvider) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.authProvider = authProvider;
    }

    /**
     * Constructor con parámetros.
     * @param nombre
     * @param email
     * @param password
     * @param authProvider
     */
    public Usuario(String nombre, String email, String authProvider) {
        this.nombre = nombre;
        this.email = email;
        this.authProvider = authProvider;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAuthProvider() {
        return authProvider;
    }
    
    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }
    
    // public String getGoogleToken() {
    //     return googleToken;
    // }

    // public void setGoogleToken(String googleToken) {
    //     this.googleToken = googleToken;
    // }

    public List<UsuarioGrupo> getGrupos() {
        return grupos;
    }

    public void setGrupos(List<UsuarioGrupo> grupos) {
        this.grupos = grupos;
    }
    public void addUsuarioGrupo(UsuarioGrupo usuarioGrupo) {
        if (grupos == null) {
            grupos = new ArrayList<>();
        }
        grupos.add(usuarioGrupo);
        usuarioGrupo.setUsuario(this);
    }

    public void removeUsuarioGrupo(UsuarioGrupo usuarioGrupo) {
        if (grupos != null) {
            grupos.remove(usuarioGrupo);
            usuarioGrupo.setUsuario(null);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Usuario)) return false;
        Usuario usuario = (Usuario) o;
        return nombre.equals(usuario.nombre) && email.equals(usuario.email) && password.equals(usuario.password) && authProvider.equals(usuario.authProvider);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre);
    }
}

