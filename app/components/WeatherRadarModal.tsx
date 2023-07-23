import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { Modal } from "flowbite-react";
import { useMemo, useState } from "react";
import { WeatherRadarMap } from "./WeatherRadarMap";

const WeatherRadarModal = () => {
  const [searchParams] = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isModalOpen = useMemo(() => location.hash.includes("showModal"), [location.hash]);

  return (
    <Modal
      size="7xl"
      onClose={() => {
        setIsClosing(true);
        navigate(
          {
            pathname: location.pathname,
            search: zipcode ? `zipcode=${searchParams.get("zipcode")}` : undefined,
          },
          { replace: true }
        );
      }}
      show={isModalOpen && !isClosing}
      dismissible
    >
      <Modal.Header>Weather Radar</Modal.Header>
      <Modal.Body>
        <WeatherRadarMap />
      </Modal.Body>
    </Modal>
  );
};

export default WeatherRadarModal;
