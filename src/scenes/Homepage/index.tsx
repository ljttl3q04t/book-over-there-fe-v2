import { useState } from "react";
import { Col, Row, Typography, Carousel, Modal } from "antd";
import CardBook from "../../component/CardBook";
const { Title } = Typography;

const Homepage = () => {
  const books = [
    { title: "Book 1", description: "Description 1" },
    { title: "Book 2", description: "Description 2" },
    { title: "Book 3", description: "Description 3" },
    { title: "Book 4", description: "Description 4" },
    { title: "Book 5", description: "Description 5" },
    { title: "Book 6", description: "Description 6" },
    { title: "Book 7", description: "Description 7" },
    { title: "Book 8", description: "Description 8" },
    { title: "Book 9", description: "Description 9" },
  ];

  const chunkSize = 3;
  const chunks = books.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, [] as any[]);

  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = (book:any) => {
    setSelectedBook(book);
  };

  const handleCloseDetails = () => {
    setSelectedBook(null);
  };


  return (
    <Row style={{ flexDirection: "column" }} gutter={[0, 32]} align="middle">
      <Row gutter={[16, 16]} justify="space-evenly" style={{ width: "100%" }}>
        {[1, 2, 3, 4].map(() => (
          <Col>
            <CardBook
              action
              content={{ title: "Hot Books", description: "Book available" }}
            />
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "center" }}>
        <Title level={4} style={{ marginTop: "1.2rem" }}>
          BOOKS GALLERY
        </Title>
        <Title level={2} style={{ margin: 0 }}>
          Popular Books
        </Title>
      </div>
      <Row gutter={[16, 16]} justify="center" style={{ width: "100%" }}>
        <Col span={18}>
          <Carousel autoplay>
            {chunks.map((chunk, index) => (
              <div key={index}>
                <Row gutter={[16, 16]} justify="space-evenly">
                  {chunk.map((book: any, bookIndex: any) => (
                    <Col key={bookIndex}>
                      <CardBook
                        height="350px"
                        heightImg="260px"
                        content={{ title: book.title, description: book.description }}
                        onClick={(item:any) => handleBookClick(item)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Carousel>
        </Col>
        {selectedBook && (
          <Modal
            title="Book Details"
            open={selectedBook !== null}
            onCancel={handleCloseDetails}
            footer={null}
          >
            {/* Render book details here based on selectedBook */}
            <p>Title: {selectedBook}</p>
            {/* Add more book details */}
          </Modal>
        )}
      </Row>
    </Row>
  );
};

export default Homepage;
