import HeaderPortfolio from "../../components/Header.vue";
import CoffeeDelivery from "../../assets/coffee-delivery.jpg"
import IgniteFeed from "../../assets/ignite-feed.jpg"
import IgniteTimer from "../../assets/ignite-timer.jpg"
import IgniteTodo from "../../assets/ignite-todo.jpg"
import ExplorerMovie from "../../assets/explorer-movie.jpg";
export default {
  name: 'work',
  components: {HeaderPortfolio},
  props: [],
  data () {
    return {
      projects: [
        {
          id: 1,
          img: CoffeeDelivery,
          name: "Coffee Delivery",
          repo: "https://github.com/Vander-Reis/coffeeDelivery",
          deploy: "https://coffee-delivery-4numhgv1l-vander-reis.vercel.app/",
        },

        {
          id: 2,
          img: IgniteFeed,
          name: "Ignite Feed",
          repo: "https://github.com/Vander-Reis/Ignite-feed-ts",
          deploy: null,
        },

        {
          id: 3,
          img: IgniteTimer,
          name: "Ignite timer",
          repo: "https://github.com/Vander-Reis/ignite-timer",
          deploy: "https://ignitetimer.vercel.app/",
        },

        {
          id: 4,
          img: IgniteTodo,
          name: "Ignite Todo",
          repo: "https://github.com/Vander-Reis/ignite-todo",
          deploy: null,
        },

        {
          id: 5,
          img: ExplorerMovie,
          name: "Explorer Movie",
          repo: "https://github.com/Vander-Reis/rocketMoviesFront",
          deploy: null,
        },
      ]

    }
  },
  computed: {

  },
  mounted () {
    document.querySelector('body').style.background = "#020202"
  },
  methods: {

  }
}


