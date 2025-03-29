package es.upm.dit.isst.splitit.service;

import es.upm.dit.isst.splitit.models.Gasto;
import es.upm.dit.isst.splitit.models.ParticipacionGasto;
import es.upm.dit.isst.splitit.models.UsuarioGrupo;
import es.upm.dit.isst.splitit.repository.GastoRepository;
import es.upm.dit.isst.splitit.repository.ParticipacionGastoRepository;
import es.upm.dit.isst.splitit.repository.UsuarioGrupoRepository;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BalanceService {

    private final GastoRepository gastoRepository;
    private final ParticipacionGastoRepository participacionGastoRepository;
    private final UsuarioGrupoRepository usuarioGrupoRepository;

    public BalanceService(GastoRepository gastoRepository, ParticipacionGastoRepository participacionGastoRepository, UsuarioGrupoRepository usuarioGrupoRepository) {
        this.gastoRepository = gastoRepository;
        this.participacionGastoRepository = participacionGastoRepository;
        this.usuarioGrupoRepository = usuarioGrupoRepository;
    }

    /**
     * Calcula los balances de los miembros de un grupo.
     * @param groupId ID del grupo.
     * @return Un mapa con el balance de cada usuario.
     */
    public Map<String, Float> calcularBalances(Integer groupId) {
        // Obtener todos los gastos del grupo
        List<Gasto> gastos = gastoRepository.findByGrupoId(groupId);

        // Obtener todos los miembros del grupo
        List<UsuarioGrupo> miembros = usuarioGrupoRepository.findByGrupoId(groupId);

        // Inicializar balances
        Map<String, Float> balances = new HashMap<>();
        for (UsuarioGrupo miembro : miembros) {
            balances.put(miembro.getUsuario().getNombre(), 0f);
        }

        // Calcular balances
        for (Gasto gasto : gastos) {
            String pagador = gasto.getPagadopor();
            Float importe = gasto.getImporte();

            // Dividir el gasto entre los participantes
            List<ParticipacionGasto> participaciones = participacionGastoRepository.findByGastoId(gasto.getId());
            float divisionEquitativa = importe / participaciones.size();

            for (ParticipacionGasto participacion : participaciones) {
                String participante = participacion.getUsuario().getNombre();
                balances.put(participante, balances.get(participante) - divisionEquitativa);
            }

            // Sumar el importe al pagador
            balances.put(pagador, balances.get(pagador) + importe);
        }

        return balances;
    }
}
