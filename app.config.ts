export default defineAppConfig({
  alpine: {
    title: 'Alpine',
    description: 'The minimalist blog theme',
    image: {
      src: '/social-card-preview.png',
      alt: 'An image showcasing my project.',
      width: 400,
      height: 300
    },
    header: {
      position: 'right',
      logo: {
        path: '/logo.svg',
        pathDark: '/logo-dark.svg',
        alt: 'alpine',
        href: '/'
      }
    },
    footer: {
      credits: {
        enabled: true,
        text: 'Alpine',
        repository: 'https://www.github.com/nuxt-themes/alpine'
      },
      navigation: true,
      alignment: 'center',
      message: 'Follow me on'
    },
    socials: {
      twitter: '',
      instagram: '',
      github: '',
      facebook: '',
      medium: '',
      youtube: ''
    },
    form: {
      successMessage: {
        es: 'Mensaje enviado. ¡Gracias!',
        en: 'Message sent. Thank you!'
      }
    },
    backToTop: {
      text: 'Back to top',
      icon: 'material-symbols:arrow-upward'
    }
  }
})
