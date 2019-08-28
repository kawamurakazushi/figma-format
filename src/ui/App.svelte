<script>
  import "./assets/figma.css";

  let separator = "/";
  let xSpacing = 32;
  let ySpacing = 32;
  let wrapCount = 10;
  let layoutDirection = "horizontal";

  // Initialize Input
  onmessage = e => {
    const settings = e.data.pluginMessage.settings;
    if (settings) {
      if (settings.separator) {
        separator = settings.separator;
      }

      if (settings.xSpacing) {
        xSpacing = settings.xSpacing;
      }

      if (settings.ySpacing) {
        ySpacing = settings.ySpacing;
      }

      if (settings.wrapCount) {
        wrapCount = settings.wrapCount;
      }

      if (settings.layoutDirection) {
        layoutDirection = settings.layoutDirection;
      }
    }
  };

  const handleClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "format",
          settings: {
            separator,
            xSpacing,
            ySpacing,
            wrapCount,
            layoutDirection
          }
        }
      },
      "*"
    );
  };
</script>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .description {
    margin: 16px;
  }

  .form {
    flex: 1;
  }

  .label {
    width: 120px;
  }

  .block {
    display: flex;
    align-items: center;
    margin: 0 8px;
  }

  .spacing {
    display: flex;
    align-items: center;
  }

  .spacingInput {
    width: 70px;
  }

  .spacingLabel {
    margin: 0 4px;
  }

  .footer {
    display: flex;
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    flex-direction: row-reverse;
  }

  .mr {
    margin-right: 8px;
  }
</style>

<div class="app">
  <div class="form">
    <div class="description type--11-pos-bold">Configure your Settings</div>
    <div class="block">
      <div class="label">Group separator</div>
      <div class="spacing">
        <input class="input" bind:value={separator} placeholder="/" />
      </div>
    </div>
    <div class="block">
      <div class="label">Spacing</div>
      <div class="spacing">
        <input
          class="input spacingInput"
          type="number"
          bind:value={xSpacing}
          placeholder="X" />
        <div class="type type--11-pos spacingLabel">X</div>
        <input
          class="input spacingInput"
          type="number"
          bind:value={ySpacing}
          placeholder="Y" />
        <div class="type type--11-pos spacingLabel">Y</div>
      </div>
    </div>
    <div class="block">
      <div class="label">Wrap count</div>
      <div class="spacing">
        <input
          class="input"
          type="number"
          bind:value={wrapCount}
          placeholder="Wrap Count" />
      </div>
    </div>
    <div class="block">
      <div class="label">Layout Direction</div>
      <div class="spacing">
        <label class="type type--11-pos mr">
          <input type="radio" bind:group={layoutDirection} value="horizontal" />
          Horizontal
        </label>
        <label class="type type--11-pos">
          <input type="radio" bind:group={layoutDirection} value="vertical" />
          Vertical
        </label>
      </div>
    </div>
  </div>
  <div class="footer">
    <button class="button button--primary" on:click|once={handleClick}>
      Save Settings & Format
    </button>
  </div>
</div>
