package es.upm.dit.isst.splitit;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsNot.not;
import static org.mockito.Mockito.timeout;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;
import java.util.HashMap;
import java.util.Map;



public class PruebacompletasinunirsegrupoTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  JavascriptExecutor js;

  @BeforeEach
  public void setUp() {
    FirefoxProfile profile = new FirefoxProfile();
    profile.setPreference("dom.webnotifications.enabled", true);
    profile.setPreference("dom.disable_beforeunload", true);
    profile.setPreference("privacy.popups.showBrowserMessage", false);

    FirefoxOptions options = new FirefoxOptions();
    options.setProfile(profile);

    driver = new FirefoxDriver(options);
    driver.manage().window().maximize(); // Maximizar la ventana del navegador
    js = (JavascriptExecutor) driver;
    vars = new HashMap<>();
  }

  @AfterEach
  public void tearDown() {
    driver.quit();
  }

  @Test
  public void pruebacompletasinunirsegrupo() {
    driver.get("http://localhost:5173/");
    //driver.manage().window().setSize(new Dimension(550, 692));
    WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(10)); // Espera hasta 10 segundos
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn-register"))).click();
    driver.findElement(By.cssSelector(".form-group:nth-child(1) > .inputInicio")).click();
    driver.findElement(By.cssSelector(".form-group:nth-child(1) > .inputInicio")).sendKeys("Pepe");
    driver.findElement(By.cssSelector(".form-group:nth-child(2) > .inputInicio")).click();
    driver.findElement(By.cssSelector(".form-group:nth-child(2) > .inputInicio")).sendKeys("pepe@mail.com");
    driver.findElement(By.cssSelector(".form-group:nth-child(3) > .inputInicio")).click();
    driver.findElement(By.cssSelector(".form-group:nth-child(3) > .inputInicio")).sendKeys("password");
    driver.findElement(By.cssSelector(".form-group:nth-child(4) > .inputInicio")).click();
    driver.findElement(By.cssSelector(".form-group:nth-child(4) > .inputInicio")).sendKeys("password");
    driver.findElement(By.cssSelector(".btn-primary")).click();
    
    wait.until(ExpectedConditions.alertIsPresent());
    Alert alert = driver.switchTo().alert();
    assertThat(alert.getText(), is("Usuario registrado correctamente. Iniciando sesión..."));
    alert.accept(); // Aceptar la alerta
    driver.findElement(By.cssSelector(".boton:nth-child(1)")).click();
    driver.findElement(By.id("groupName")).click();
    driver.findElement(By.id("groupName")).sendKeys("prueba");
    driver.findElement(By.id("participantSearch")).click();
    driver.findElement(By.id("participantSearch")).sendKeys("vio");
    driver.findElement(By.cssSelector("li")).click();
    driver.findElement(By.id("participantSearch")).click();
    driver.findElement(By.id("participantSearch")).sendKeys("j");
    driver.findElement(By.cssSelector("li:nth-child(2)")).click();
    driver.findElement(By.id("participantSearch")).click();
    driver.findElement(By.id("participantSearch")).sendKeys("j");
    driver.findElement(By.cssSelector("li:nth-child(1)")).click();
    driver.findElement(By.id("participantSearch")).click();
    driver.findElement(By.id("participantSearch")).sendKeys("j");
    driver.findElement(By.cssSelector("li:nth-child(3)")).click();
    driver.findElement(By.id("participantSearch")).click();
    driver.findElement(By.id("participantSearch")).sendKeys("p");
    driver.findElement(By.cssSelector("li:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".btn")).click();
    wait.until(ExpectedConditions.alertIsPresent());
    Alert alert2 = driver.switchTo().alert();
    assertThat(alert2.getText(), is("Grupo creado correctamente"));
    alert.accept(); // Aceptar la alerta
    timeout(7000);
    WebElement tarjetaGrupo = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".tarjetaGrupo")));
    tarjetaGrupo.click();
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".boton-anadirgasto")));
    driver.findElement(By.cssSelector(".boton-anadirgasto")).click();
    driver.findElement(By.id("gastoName")).click();
    driver.findElement(By.id("gastoName")).sendKeys("prueba_gasto");
    driver.findElement(By.cssSelector(".form-group:nth-child(2) > .btn")).click();
    {
      WebElement element = driver.findElement(By.cssSelector(".form-group:nth-child(2) > .btn"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector("li:nth-child(5) > .btnotrocolor")).click();
    driver.findElement(By.id("Importe")).click();
    driver.findElement(By.id("Importe")).sendKeys("30");
    driver.findElement(By.cssSelector(".form-group:nth-child(4) > .btn")).click();
    driver.findElement(By.cssSelector(".participant-item:nth-child(4) input")).click();
    driver.findElement(By.cssSelector(".participant-item:nth-child(3)")).click();
    driver.findElement(By.cssSelector(".participant-item:nth-child(3) input")).click();
    driver.findElement(By.cssSelector(".participant-item:nth-child(2) input")).click();
    driver.findElement(By.cssSelector(".participant-item:nth-child(1) > label")).click();
    driver.findElement(By.cssSelector(".btn:nth-child(3)")).click();
    driver.findElement(By.cssSelector(".btn:nth-child(1)")).click();
    wait.until(ExpectedConditions.alertIsPresent());
    Alert alert3 = driver.switchTo().alert();
    assertThat(alert3.getText(), is("Gasto creado correctamente"));
    alert.accept(); // Aceptar la alerta
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".noseleccionado")));
    driver.findElement(By.cssSelector(".noseleccionado")).click();
    driver.findElement(By.cssSelector(".tarjetagastos:nth-child(1) > .filagastos")).click();
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("input")));
    driver.findElement(By.cssSelector("input")).click();
    driver.findElement(By.cssSelector(".btn")).click();
    driver.findElement(By.cssSelector(".tarjetagastos:nth-child(2) > .filagastos")).click();
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("input")));
    driver.findElement(By.cssSelector("input")).click();
    driver.findElement(By.cssSelector(".btn")).click();
    driver.findElement(By.cssSelector(".tarjetagastos:nth-child(4) > .filagastos")).click();
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("input")));
    driver.findElement(By.cssSelector("input")).click();
    driver.findElement(By.cssSelector(".btn")).click();
    driver.findElement(By.cssSelector(".noseleccionado")).click();
    driver.findElement(By.cssSelector(".tarjetagastos")).click();
    driver.findElement(By.cssSelector(".btn-primary")).click();
    driver.findElement(By.xpath("(//input)[1]")).clear();
    driver.findElement(By.xpath("(//input)[1]")).sendKeys("gasto_modificado");
    driver.findElement(By.xpath("(//input)[2]")).clear();
    driver.findElement(By.xpath("(//input)[2]")).sendKeys("Pepe");
    driver.findElement(By.xpath("(//input)[3]")).clear();
    driver.findElement(By.xpath("(//input)[3]")).sendKeys("80");;
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn-primary")));
    WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn-primary")));
    //wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".tarjetagastos")));
    Actions actions = new Actions(driver);
    WebElement button1 = driver.findElements(By.cssSelector(".btn-primary")).get(1);
    actions.moveToElement(button1).click().perform();
    wait.until(ExpectedConditions.alertIsPresent());
    Alert alert5 = driver.switchTo().alert();
    assertThat(alert5.getText(), is("Gasto actualizado correctamente"));
    alert5.accept();
    //driver.findElements(By.cssSelector(".tarjetagastos")).get(0).click();
    driver.findElement(By.cssSelector(".btn-danger")).click();
    wait.until(ExpectedConditions.alertIsPresent());
    Alert alert4 = driver.switchTo().alert();
    assertThat(alert4.getText(), is("¿Estás seguro de que deseas eliminar el gasto \"prueba_gasto\"?"));
    alert4.accept();


    


  }
}
