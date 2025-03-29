package es.upm.dit.isst.splitit.repository;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.Gasto;

public interface GastoRepository extends CrudRepository<Gasto, Integer> {
    // Aquí puedes agregar métodos personalizados si es necesario
    // Por ejemplo, para buscar gastos por grupo o usuario
    //List<Gasto> findByGrupo(GrupodeGastos grupo);
    // List<Gasto> findByUsuario(Usuario usuario);
}
