import CardBook from "@/component/CardBook";
import Section from "@/component/carousel/Section";
import { RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import Title from "antd/es/skeleton/Title";
import { DataTypeClubBook, DataTypeClubSlide } from "./types";

export function ClubSection({ clubList }) {
  return (
    <>
      {clubList &&
        clubList.map((item: DataTypeClubSlide) => (
          <div className="club">
            <div onClick={() => handleViewAllClubBooks(item.clubBookIds, item.clubId)} className="carousel-title">
              <Title level={2} style={{ margin: 0 }}>
                <a style={{ textDecoration: "none" }} onClick={() => executeScroll()} rel="noopener noreferrer">
                  {item.clubName}
                </a>
                <span onClick={() => executeScroll()} className="extra-title">
                  <>{t("homePage.seeAll")}</> <RightOutlined style={{ fontSize: "18px" }} />
                </span>
              </Title>
            </div>
            <Section>
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={false}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                // autoPlay={deviceType !== "mobile" ? true : false}
                // autoPlay={false}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                // customTransition="linear 1"
                transitionDuration={300}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="image-item"
              >
                {item.clubBookInfor.map((book: DataTypeClubBook, index) => (
                  <CardBook
                    srcImg={book.image}
                    key={index}
                    height="400px"
                    content={{
                      title: book.bookName,
                      description: book.publisherName,
                    }}
                    router={`/book-detail/:id}`}
                  />
                ))}
              </Carousel>
            </Section>
          </div>
        ))}
    </>
  );
}
