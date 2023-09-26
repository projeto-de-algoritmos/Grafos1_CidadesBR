import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { City, getCities } from "../../api/city";
import { getRoute } from "../../api/route";
import { AxiosError } from "axios";
import CitySelect from "../../components/CitySelect";
import Map from "../../components/Map";
import styles from "./styles.module.scss";
import { CircularProgress } from "@mui/material";

export default function App() {
  // Query para buscar as cidades disponíveis. É executada apenas uma vez ao carregar a página
  const {
    data: cities,
    status: citiesStatus,
    error: citiesError,
  } = useQuery({
    queryKey: ["availableCities"],
    queryFn: getCities,
    refetchOnWindowFocus: false,
  });

  // Query para buscar a rota depois que o usuário selecionar as cidades
  const {
    mutate: requestGetRoute,
    status: getRouteStatus,
    error: getRouteError,
    data: route,
  } = useMutation({
    mutationFn: getRoute,
  });

  // Estado local
  const [origin, setOrigin] = useState<City | null>(null);
  const [destination, setDestination] = useState<City | null>(null);

  // Função que é executada quando o usuário clica no botão de buscar
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!origin || !destination) {
      return;
    }

    requestGetRoute({
      from: origin.id,
      to: destination.id,
    });
  }

  // Caso a query de cidades ainda esteja carregando, exibe uma mensagem de carregamento
  if (citiesStatus === "loading") {
    return (
      <main className={styles.container} style={{ justifyContent: "center" }}>
        <CircularProgress />
      </main>
    );
  }

  // Caso a query de cidades tenha retornado um erro, exibe uma mensagem de erro
  if (citiesStatus === "error") {
    if (citiesError instanceof AxiosError) {
      return <div>Error: {citiesError.message}</div>;
    }

    return <div>Unknown error</div>;
  }

  // Ao executar a query de rota, exibe uma mensagem de carregamento
  // Ao retornar um erro, exibe uma mensagem de erro
  // Ao retornar com sucesso, exibe o botão de buscar
  function RequestRouteButton() {
    if (getRouteStatus === "loading") {
      return (
        <p>
          {`Requesting route from ${origin?.name} to ${destination?.name}`}...
        </p>
      );
    }

    if (getRouteStatus === "error") {
      if (getRouteError instanceof AxiosError) {
        return (
          <>
            <p>Error: {getRouteError.message}</p>
            <button type="submit">Buscar</button>
          </>
        );
      }

      return (
        <>
          <p>Unknown error</p>
          <button type="submit">Buscar</button>
        </>
      );
    }

    return <button type="submit">Buscar</button>;
  }

  return (
    <main className={styles.container}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.selectContainer}>
          <CitySelect
            label="Cidade de origem"
            cities={cities}
            value={origin}
            onChange={setOrigin}
          />

          <CitySelect
            label="Cidade de destino"
            cities={cities}
            value={destination}
            onChange={setDestination}
          />
        </div>

        <RequestRouteButton />
      </form>

      {route ? (
        <Map route={route} />
      ) : (
        <p>Selecione as cidades para exibir a rota</p>
      )}
    </main>
  );
}
