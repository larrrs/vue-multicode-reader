module.exports = {
  title: 'Vue Multicode Reader',
  description: 'A fork of https://gruhn.github.io/vue-qrcode-reader integrating https://github.com/ericblade/quagga2 1D barcode reader',

  base: '/vue-multicode-reader/',

  extraWatchFiles: [
    '../src/'
  ],

  themeConfig: {
    repo: 'larrrs/vue-multicode-reader',

    sidebar: {
      '/demos/': [
        'Simple',
        'DecodeAll',
        'CustomTracking',
        'LoadingIndicator',
        'ScanSameQrcodeMoreThanOnce',
        'Validate',
        'SwitchCamera',
        'Fullscreen',
        'Torch',
        'DragDrop',
        'Upload'
      ],

      '/api/': [
        'QrcodeStream',
        'QrcodeDropZone',
        'QrcodeCapture'
      ],
    },

    nav: [
      { text: 'Live Demos', link: '/demos/CustomTracking' },
      { text: 'API Reference', link: '/api/QrcodeStream' }
    ]
  }
}
