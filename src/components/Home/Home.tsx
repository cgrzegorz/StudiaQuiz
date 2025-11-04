import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
export const Home = () => {
  return (
    <>
      <Container fluid="md" className="mt-3">
        <ul>
          <li>
            <Link to="/ekonomia1">Ekonomia</Link>
          </li>
          <li>
            <Link to="/ochronaWlasnosci1">Ochrona Własności</Link>
          </li>
        </ul>
      </Container>
    </>
  );
};
