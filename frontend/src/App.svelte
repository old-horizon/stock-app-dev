<script lang="ts">
  import { onMount } from "svelte";
  import { container } from "tsyringe";
  import { Id, Name } from "./domain/stock";
  import { StockUsecase } from "./usecase/stockUsecase";
  import { StockState, StockUnit } from "./views/state/stockState";

  export let name: string;

  const state = container.resolve(StockState);
  const usecase = container.resolve(StockUsecase);

  const stocks = state.stocks;

  onMount(async () => {
    await usecase.list();
  });

  const save = () => {
    usecase.save();
  };

  const edit = (id: string) => {
    usecase.edit(new Id(id));
  };

  const update = (id: string, name: string) => {
    usecase.update(new Id(id), new Name(name));
  };

  const increase = (id: string) => {
    usecase.increase(new Id(id));
  };

  const decrease = (id: string) => {
    usecase.decrease(new Id(id));
  };
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>
  <button on:click={() => save()}>save</button>
  <ul>
    {#each $stocks as stock}
      <li style="display: flex;">
        {#if stock.editing}
          <input
            on:blur={(e) => update(stock.id, e.target["value"])}
            value={stock.name}
          />
        {:else}
          <span on:click={() => edit(stock.id)}>
            {stock.name}
          </span>
        {/if}
        <span>
          {stock.quantity}
        </span>
        <button on:click={() => decrease(stock.id)}> - </button>
        <button on:click={() => increase(stock.id)}> + </button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
