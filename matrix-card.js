class MatrixCard extends HTMLElement {
  static getStubConfig() {
    return {
      speed: 1,
      font_size: 16,
      color: "#03a9f4",
      background_color: "#00131f",
      height: 220,
    };
  }

  setConfig(config) {
    if (!this._card) {
      this._renderCard();
    }

    this._config = {
      speed: 1,
      font_size: 16,
      color: "#03a9f4",
      background_color: "#00131f",
      height: 220,
      characters: "01アイウエオカキクケコサシスセソタチツテトナニヌネノ",
      trail_alpha: 0.15,
      ...config,
    };

    this._applyConfig();
  }

  disconnectedCallback() {
    this._stopAnimation();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  getCardSize() {
    return Math.max(2, Math.round((this._config?.height || 220) / 100));
  }

  _renderCard() {
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      ha-card {
        overflow: hidden;
        position: relative;
      }

      .wrap {
        width: 100%;
        height: 100%;
      }

      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;

    this._card = document.createElement("ha-card");
    this._wrapper = document.createElement("div");
    this._wrapper.className = "wrap";
    this._canvas = document.createElement("canvas");
    this._ctx = this._canvas.getContext("2d");

    this._wrapper.appendChild(this._canvas);
    this._card.appendChild(this._wrapper);
    this.shadowRoot.append(style, this._card);

    this._resizeObserver = new ResizeObserver(() => this._resizeCanvas());
    this._resizeObserver.observe(this._wrapper);
  }

  _applyConfig() {
    if (!this._card || !this._ctx) return;

    this._card.style.height = `${this._config.height}px`;
    this._resizeCanvas();
    this._startAnimation();
  }

  _resizeCanvas() {
    if (!this._canvas || !this._ctx) return;

    const bounds = this._wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(bounds.width));
    const height = Math.max(1, Math.floor(bounds.height));

    this._canvas.width = Math.floor(width * dpr);
    this._canvas.height = Math.floor(height * dpr);

    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = Math.max(8, Number(this._config.font_size) || 16);
    this._columns = Math.max(1, Math.floor(width / fontSize));
    this._drops = new Array(this._columns).fill(1);
  }

  _startAnimation() {
    this._stopAnimation();

    const speed = Math.max(0.2, Number(this._config.speed) || 1);
    const trailAlpha = Math.min(1, Math.max(0.01, Number(this._config.trail_alpha) || 0.15));
    const chars = (this._config.characters || "01").split("");
    const fontSize = Math.max(8, Number(this._config.font_size) || 16);

    const step = () => {
      if (!this._ctx || !this._canvas) return;

      const width = this._canvas.width / (window.devicePixelRatio || 1);
      const height = this._canvas.height / (window.devicePixelRatio || 1);

      this._ctx.fillStyle = this._hexToRgba(this._config.background_color, trailAlpha);
      this._ctx.fillRect(0, 0, width, height);

      this._ctx.fillStyle = this._config.color;
      this._ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < this._drops.length; i += 1) {
        const text = chars[Math.floor(Math.random() * chars.length)] || "0";
        const x = i * fontSize;
        const y = this._drops[i] * fontSize;

        this._ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          this._drops[i] = 0;
        }

        this._drops[i] += speed;
      }

      this._animationFrame = window.requestAnimationFrame(step);
    };

    this._animationFrame = window.requestAnimationFrame(step);
  }

  _stopAnimation() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
  }

  _hexToRgba(hex, alpha) {
    const value = String(hex || "#00131f").replace("#", "");
    const normalized = value.length === 3
      ? value.split("").map((c) => c + c).join("")
      : value;

    const int = Number.parseInt(normalized, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

customElements.define("matrix-card", MatrixCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matrix-card",
  name: "Matrix Card",
  description: "Matrix style code rain animation for Home Assistant",
});
