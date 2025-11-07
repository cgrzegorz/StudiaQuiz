import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";


const semestersConfig = [
  {
    id: 1, 
    title: "Semestr 1",
    courses: [
      {
        name: "Ekonomia",
        path: "/ekonomia1",
        variant: "primary",
      },
      {
        name: "Ochrona Własności",
        path: "/ochronaWlasnosci1",
        variant: "outline-secondary",
      },
    ],
  },
];




export const Home = () => {
  return (
    <>
      <Container fluid="md" className="mt-4 text-center">
        {semestersConfig
          .slice() 
          .sort((a, b) => b.id - a.id) 
          .map((semester) => (
            
            <div key={semester.id} className="mb-5">
              <h2>{semester.title}</h2>
              <Row className="justify-content-md-center g-3">
                {semester.courses.map((course) => (
                  <Col key={course.name} md="auto">
                    <Link
                      to={course.path}
                      className={`btn btn-${course.variant} btn-lg p-3`}
                    >
                      {course.name}
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
      </Container>
    </>
  );
};