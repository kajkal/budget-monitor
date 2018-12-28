package budget_monitor.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component("jwtProvider")
public class JwtProvider {

    @Value("${security.jwt.token.secret-key}")
    private String jwtSecretKey;

    @Value("${security.jwt.token.expire-after}")
    private long jwtExpireAfter;


    public String generateJwtToken(Authentication authentication) {
        JwtUser user = (JwtUser) authentication.getPrincipal();

        Date issuedAt = new Date();
        Date expireAfter = new Date(issuedAt.getTime() + TimeUnit.MINUTES.toMillis(jwtExpireAfter));

        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(",")));
        claims.put("currency", user.getCurrency());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt)
                .setExpiration(expireAfter)
                .signWith(SignatureAlgorithm.HS512, jwtSecretKey)
                .compact();
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecretKey).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException ignored) {
        }
        return false;
    }

    public UserDetails getUserDetailsFromJwtToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecretKey)
                .parseClaimsJws(token)
                .getBody();

        return User.builder()
                .username(claims.getSubject())
                .password("***")
                .authorities(AuthorityUtils.commaSeparatedStringToAuthorityList(claims.get("roles").toString()))
                .build();
    }

}
