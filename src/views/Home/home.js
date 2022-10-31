import HeaderPortfolio from '../../components/Header.vue';
import ProfilePhoto from '../../assets/profile.png';
import Curriculo from '../../assets/cv.pdf'

export default {
      data: function () {
          return {
              profile: ProfilePhoto,
              cv: Curriculo

          }
      },
      components: {
        HeaderPortfolio
      },   
      
      mounted () {
        document.querySelector('body').style.background = "#020202"

        const titulo = document.querySelector('p');

        function typeWrite(elemento) {
          const textArray = elemento.innerHTML.split('');
          console.log(textArray)
          elemento.innerHTML = ' ';

          textArray.forEach((letra, i) => {
            setTimeout(() => {
              elemento.innerHTML += letra;
            }, 75 * i);
          });
        }

        typeWrite(titulo);
      },
      
}