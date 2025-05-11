package es.upm.dit.isst.splitit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;


import es.upm.dit.isst.splitit.models.Gasto;
import es.upm.dit.isst.splitit.models.GrupodeGastos;
import es.upm.dit.isst.splitit.models.UsuarioGrupo;
import es.upm.dit.isst.splitit.models.UsuarioGrupoId;
import es.upm.dit.isst.splitit.models.Usuario;
import es.upm.dit.isst.splitit.models.ParticipacionGasto;
import es.upm.dit.isst.splitit.models.ParticipacionGastoId;

import es.upm.dit.isst.splitit.repository.GastoRepository;
import es.upm.dit.isst.splitit.repository.GrupodeGastosRepository;
import es.upm.dit.isst.splitit.repository.ParticipacionGastoRepository;
import es.upm.dit.isst.splitit.repository.UsuarioGrupoRepository;
import es.upm.dit.isst.splitit.repository.UsuarioRepository;

@SpringBootTest
class SplititApplicationTests {

	@Autowired
	private GastoRepository gastoRepository;
	@Autowired
	private GrupodeGastosRepository grupodeGastosRepository;
	@Autowired
	private UsuarioGrupoRepository usuarioGrupoRepository;
	@Autowired
	private UsuarioRepository usuarioRepository;
	@Autowired
	private ParticipacionGastoRepository participacionGastoRepository;


@BeforeEach
void limpiarBaseDeDatos() {
    // Debido a las relaciones entre entidades, el orden de eliminación es importante
    // Primero eliminar entidades dependientes
    participacionGastoRepository.deleteAll();
    usuarioGrupoRepository.deleteAll();
    
    // Luego las entidades intermedias
    gastoRepository.deleteAll();
    
    // Finalmente las entidades principales
    usuarioRepository.deleteAll();
    grupodeGastosRepository.deleteAll();
}

	@Test
	final void pruebaBaseDatosBueno() {
	    // Crear usuario
	    Usuario usuario = new Usuario();
	    usuario.setEmail("prueba@mail.com");
	    usuario.setNombre("Prueba");
	    usuario.setPassword("password");
		usuario.setAuthProvider("local");
	    usuarioRepository.save(usuario);
	    
	    // Recuperar usuario usando el nombre que conocemos
	    Usuario usuarioRecuperado = usuarioRepository.findById("Prueba").get();
	    assertEquals(usuario.getNombre(), usuarioRecuperado.getNombre());
	    assertEquals(usuario.getEmail(), usuarioRecuperado.getEmail());
	    
	    // Crear grupo de gastos
	    GrupodeGastos grupo = new GrupodeGastos();
	    grupo.setNombre("Grupo de prueba");
		grupo.setId(10000000);
	    grupodeGastosRepository.save(grupo);
	    
	    // Recuperar el grupo usando el ID que se generó automáticamente
	    int grupoId = grupo.getId(); // Obtiene el ID asignado por la BD
	    GrupodeGastos grupoRecuperado = grupodeGastosRepository.findById(grupoId).get();
	    assertEquals(grupo.getNombre(), grupoRecuperado.getNombre());
	    
	    // Crear gasto
	    Gasto gasto = new Gasto();
	    gasto.setConcepto("Gasto de prueba");
	    gasto.setPagadopor("Descripción de prueba");
	    gasto.setImporte(100.00f);
	    gasto.setGrupo(grupo);
	    gastoRepository.save(gasto);
	    
	    // Recuperar gasto usando el ID que se generó automáticamente
	    int gastoId = gasto.getId(); // Obtiene el ID asignado por la BD
	    Gasto gastoRecuperado = gastoRepository.findById(gastoId).get();
	    assertEquals(gasto.getConcepto(), gastoRecuperado.getConcepto());
	    assertEquals(gasto.getPagadopor(), gastoRecuperado.getPagadopor());
	    assertEquals(gasto.getImporte(), gastoRecuperado.getImporte());
	}

	@Test
	final void datosMalosUsuario() {
		// Crear un nuevo grupo de gastos
		Usuario usuario = new Usuario();
		usuario.setEmail("nosoyemail");
		usuario.setNombre("prueba");
		usuario.setPassword("password");
		usuario.setAuthProvider("local");
	
		Exception exception = assertThrows(Exception.class, () -> usuarioRepository.save(usuario));
		// Comprobar que se lanza la excepción
		System.err.println(exception.getMessage());
	}

	@Test
	final void datosMalosGrupo() {
		// Crear un nuevo grupo de gastos
		GrupodeGastos grupo = new GrupodeGastos();
		grupo.setNombre("");
		grupo.setId(10000000);

		Exception exception = assertThrows(Exception.class, () -> grupodeGastosRepository.save(grupo));

		GrupodeGastos grupo2 = new GrupodeGastos();
		grupo2.setNombre(null);
		grupo.setId(10000001);

		Exception exception2 = assertThrows(Exception.class, () -> grupodeGastosRepository.save(grupo2));

		System.err.println(exception.getMessage());
		System.err.println(exception2.getMessage());
	}

	@Test
	final void datosMalosGasto() {
		// Crear un nuevo grupo de gastos

		GrupodeGastos grupo = new GrupodeGastos();
		grupo.setNombre("Grupo de prueba");
		grupo.setId(10000000);
		grupodeGastosRepository.save(grupo);

		Gasto gasto = new Gasto();
		gasto.setConcepto("");
		gasto.setPagadopor("Descripción de prueba");
		gasto.setImporte(100.00f);
		gasto.setGrupo(grupo);

		Exception exception = assertThrows(Exception.class, () -> gastoRepository.save(gasto));

		System.err.println(exception.getMessage());

		Gasto gasto2 = new Gasto();
		gasto2.setConcepto("Gasto de prueba");
		gasto2.setPagadopor("User");
		gasto2.setImporte(-100.00f);
		gasto2.setGrupo(grupo);

		Exception exception2 = assertThrows(Exception.class, () -> gastoRepository.save(gasto2));
		System.err.println(exception2.getMessage());

	}

	@Test
	final void pruebaEliminacionCascada(){
		// Creando usuarios
		Usuario usuario1 = new Usuario();
		usuario1.setEmail("prueba@mail.com");
		usuario1.setNombre("Prueba");
		usuario1.setPassword("password");
		usuario1.setAuthProvider("local");

		usuarioRepository.save(usuario1);

		Usuario usuario2 = new Usuario();
		usuario2.setEmail("email@mail.com");
		usuario2.setNombre("Prueba2");
		usuario2.setPassword("password");
		usuario2.setAuthProvider("local");
		usuarioRepository.save(usuario2);

		Usuario usuario3 = new Usuario();
		usuario3.setEmail("emailprueba@mail.com");
		usuario3.setNombre("Prueba3");
		usuario3.setPassword("password");
		usuario3.setAuthProvider("local");
		usuarioRepository.save(usuario3);

		//creando grupos
		GrupodeGastos grupo = new GrupodeGastos();
		grupo.setNombre("Grupo de prueba");
		grupo.setId(10000000);
		grupodeGastosRepository.save(grupo);

		GrupodeGastos grupo2 = new GrupodeGastos();
		grupo2.setNombre("Viaje a Italia");
		grupo2.setId(10000001);
		grupodeGastosRepository.save(grupo2);

		//Creando Gastos
		Gasto gasto = new Gasto();
		gasto.setConcepto("Comida Italia");
		gasto.setPagadopor("Prueb2");
		gasto.setImporte(100.00f);
		gasto.setGrupo(grupo2);
		gastoRepository.save(gasto);

		Gasto gasto1 = new Gasto();
		gasto1.setConcepto("Gasto de prueba");
		gasto1.setPagadopor("Prueba");
		gasto1.setImporte(30.00f);
		gasto1.setGrupo(grupo);
		gastoRepository.save(gasto1);



		// Creando participaciones
		ParticipacionGasto participacion1 = new ParticipacionGasto();
		participacion1.setGasto(gasto1);
		participacion1.setUsuario(usuario1);
		participacion1.setImporte(10.00f);
		participacionGastoRepository.save(participacion1);

		ParticipacionGasto participacion2 = new ParticipacionGasto();
		participacion2.setGasto(gasto1);
		participacion2.setUsuario(usuario2);
		participacion2.setImporte(20.00f);
		participacionGastoRepository.save(participacion2);

		UsuarioGrupo usuarioGrupo = new UsuarioGrupo();
		usuarioGrupo.setGrupo(grupo);
		usuarioGrupo.setUsuario(usuario1);
		usuarioGrupo.setApodo("Prueba1");
		usuarioGrupoRepository.save(usuarioGrupo);

		UsuarioGrupo usuarioGrupo2 = new UsuarioGrupo();
		usuarioGrupo2.setGrupo(grupo);
		usuarioGrupo2.setUsuario(usuario2);
		usuarioGrupo2.setApodo("Prueba2");
		usuarioGrupoRepository.save(usuarioGrupo2);

		UsuarioGrupo usuarioGrupo3 = new UsuarioGrupo();
		usuarioGrupo3.setGrupo(grupo2);
		usuarioGrupo3.setUsuario(usuario3);
		usuarioGrupo3.setApodo("Prueba3");
		usuarioGrupoRepository.save(usuarioGrupo3);
		
		// Comprobando resistencia a la eliminación


		Exception exception = assertThrows(Exception.class, () -> usuarioRepository.deleteById("Prueba"));
		System.err.println(exception.getMessage());

	}




}
