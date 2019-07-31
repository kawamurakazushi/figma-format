<script>
  export let name;

  onmessage = e => {
    console.log(e);
  };

  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: "format", count: 1 } }, "*");
  };
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello! {name}!</h1>
<button on:click|once={handleClick}>Format!</button>
