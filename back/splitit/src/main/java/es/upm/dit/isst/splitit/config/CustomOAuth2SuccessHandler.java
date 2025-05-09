package es.upm.dit.isst.splitit.config;

import java.io.IOException;
import java.security.Key;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import es.upm.dit.isst.splitit.models.Usuario;
import es.upm.dit.isst.splitit.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final String SECRET_KEY = "mySuperSecretKey1234567890123456";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = authToken.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Verifica si ya tienes al usuario, si no, créalo
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setEmail(email);
                    nuevo.setNombre(name);
                    nuevo.setAuthProvider("google");
                    return usuarioRepository.save(nuevo);
                });

        // Genera JWT
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        String token = Jwts.builder()
                .subject(usuario.getNombre())
                .signWith(key)
                .compact();

        // Devuelve cookie
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(60 * 60 * 24)
                .build();

        response.setHeader("Set-Cookie", cookie.toString());

        // Redirige al frontend
        response.sendRedirect("http://localhost:5173/grupoGastos"); // tu frontend React
    }
}