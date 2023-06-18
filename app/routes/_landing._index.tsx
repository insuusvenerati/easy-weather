import {
  Form,
  isRouteErrorResponse,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useRef } from "react";
import { WeatherCard } from "~/components/WeatherCard";
import type { IndexLoaderData } from "~/types/weather";
import { useMatchesData } from "~/utils";

const Index = () => {
  const [searchParams] = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const data = useMatchesData<IndexLoaderData>("routes/_landing");
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  return (
    <>
      <Form className="mt-8 mb-8 flex flex-col gap-4" action="/?index" method="GET">
        <Label htmlFor="zipcode">Zip Code</Label>

        <TextInput
          disabled={isLoading}
          defaultValue={zipcode ?? ""}
          type="search"
          id="zipcode"
          name="zipcode"
          placeholder="96605"
          required
          helperText={data?.error ? data.error : ""}
        />
        <Button type="submit" disabled={isLoading}>
          {!isLoading ? "Search" : <Spinner />}
        </Button>
      </Form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data &&
          data?.weather?.daily?.data?.map((day) => (
            <WeatherCard key={day.time} city={data.city} day={day} />
          ))}
      </div>
    </>
  );
};

export default Index;

export const ErrorBoundary = () => {
  const error = useRouteError();
  const stackRef = useRef<HTMLElement>(null);
  console.log(error);

  const onClick = () => {
    if (stackRef.current) {
      navigator.clipboard.writeText(stackRef.current.innerText);

      alert("Copied to clipboard");
    }
  };

  if (isRouteErrorResponse(error)) {
    return (
      <div className="container mx-auto mt-auto">
        <h1 className="text-xl font-bold">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">
          Oof! Sorry about that. There's a problem with the app. I'll get on it as soon as possible
        </h1>
        <p>
          Please open a new issue here:{" "}
          <a
            className="underline font-semibold"
            href="https://github.com/insuusvenerati/easy-weather/issues/new"
            rel="noreferrer noopener"
          >
            Report an issue
          </a>
        </p>
        <div className="flex flex-col gap-4">
          Here is a copy of the stacktrace if you feel so inclinded to include it:{" "}
          <pre>
            <code ref={stackRef}>{error.stack}</code>
          </pre>
          <Button onClick={onClick} type="button">
            Copy error
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <h1 className="text-xl">Unknown Error 😔</h1>
        <p>I'm not sure what happened here.</p>
        <p>
          Please open a new issue here:{" "}
          <a
            className="underline font-semibold"
            href="https://github.com/insuusvenerati/easy-weather/issues/new"
          >
            Report an issue
          </a>
        </p>
      </>
    );
  }
};
