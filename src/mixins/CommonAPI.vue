<script>
import BarcodeDetector from "barcode-detector"

export default {
  
  data() {
    return {
      qg: {
        timer: null,
        val: '',
      },
    };
  },

  beforeMount() {
    // if (!('BarcodeDetector' in window)) {
    window.BarcodeDetector = BarcodeDetector
    // }
  },

  methods: {
    async onDetect(resultPromise) {
      this.$emit("detect", resultPromise);

      try {
        const { content } = await resultPromise;  
        if (content !== null) {
          this.$emit("decode", content);
        }
      } catch (error) {
        console.error(error);
        // fail silently
      }
    },

    quaggaHandler(cb) {

      if(!this.isQuaggaError(cb.codeResult.decodedCodes)) {
        
        // Set tracking
        this.onLocate(this.getQuaggaLocation(
          cb.codeResult.code,
          cb.codeResult.format,
          cb.box
        ));
        clearTimeout(this.qg.timer);
        this.qg.timer = setTimeout(() => {  
          this.clearCanvas(this.$refs.trackingLayer);
        }, 100);

        // Emit result
        if(this.qg.val != cb.codeResult.code) {
          this.qg.val = cb.codeResult.code;
          const result = {
            content: this.qg.val,
            format: cb.codeResult.format
          }
          this.$emit("detect", Promise.resolve(result));
          this.$emit("decode", this.qg.val);
        }
      } else {
        console.log('filtered quagga result: ', cb.codeResult.code);
      }
    },

    isQuaggaError(codes) {

      // Average codeError, from 0 (very accurate) to 1
      const codeError = codes.filter(code => code.error).reduce((acc, code) => acc + code.error, 0) / codes.filter(code => code.error).length;
      
      return codeError > 0.1;
    },

    getQuaggaLocation(rawValue, format, poly) {
      
      // Map poly corner points
      const cornerPoints = [
        {x: poly[1][0], y: poly[1][1]}, // top left
        {x: poly[2][0], y: poly[2][1]}, // top right
        {x: poly[3][0], y: poly[3][1]}, // bottom right
        {x: poly[0][0], y: poly[0][1]}  // bottom left
      ];

      // Determine bounding box
      const boxLeft = Math.min(poly[1][0], poly[0][0]);
      const boxTop = Math.min(poly[1][1], poly[2][1]);
      const boundingBox = new DOMRectReadOnly(
        boxLeft,
        boxTop,
        Math.max(poly[2][0], poly[3][0]) - boxLeft, // boxWidth
        Math.max(poly[0][1], poly[3][1]) - boxTop   // boxHeight
      );

      // Return location object
      const location = {
          cornerPoints,
          boundingBox,
          rawValue,
          format
      };
      return [{...location}];
    },
  }
};
</script>
