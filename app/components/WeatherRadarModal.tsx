import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { Modal, Spinner } from "flowbite-react";
import { Suspense, useMemo } from "react";
import { WeatherRadarMap } from "./WeatherRadarMap";

const WeatherRadarModal = () => {
  const [searchParams] = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const navigate = useNavigate();
  const location = useLocation();
  const isModalOpen = useMemo(() => location.hash.includes("showModal"), [location.hash]);

  return (
    <Suspense fallback={<Spinner />}>
      <Modal
        size="7xl"
        onClose={() =>
          navigate(
            {
              pathname: location.pathname,
              search: zipcode ? `zipcode=${searchParams.get("zipcode")}` : undefined,
            },
            { replace: true }
          )
        }
        show={isModalOpen}
        dismissible
      >
        <Modal.Header>Weather Radar</Modal.Header>
        <Modal.Body>
          <WeatherRadarMap />
        </Modal.Body>
      </Modal>
    </Suspense>
  );
};

export default WeatherRadarModal;
