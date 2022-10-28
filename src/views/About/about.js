import HeaderPortfolio from "../../components/Header.vue";

export default {
  name: "about",
  components: { HeaderPortfolio },
  props: [],
  data() {
    return {
      skills: [
        {
          id: 1,
          name: "HTML",
        },
        {
          id: 2,
          name: "CSS",
        },
        {
          id: 3,
          name: "JavaScript",
        },
        {
          id: 4,
          name: "ReactJS",
        },
        {
          id: 5,
          name: "NodeJS",
        },
        {
          id: 6,
          name: "Styled-components",
        },
        {
          id: 7,
          name: "VueJS",
        },
        {
          id: 8,
          name: "Sass",
        },
      ],
    };
  },
  computed: {},
  mounted() {
    document.querySelector("body").style.background = "#252525";
  },
  methods: {},
};
