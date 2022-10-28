import HeaderPortfolio from '../../components/Header.vue';

export default {
  name: 'contact',
  components: {HeaderPortfolio},
  props: [],
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
    document.querySelector("body").style.background = "#252525";
    document.querySelector("button").addEventListener('click', (event) => {
      event.preventDefault();
    })
  },
  methods: {

  }
}


