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
      },
}