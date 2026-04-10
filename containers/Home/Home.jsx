"use client";

import { HomeWrapper } from "./Home.style";
import {
  App,
  Button,
  Carousel,
  Flex,
  Form,
  Input,
  Modal,
  Rate,
  Image as AntdImage,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Home = ({ webSite }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1300;

  if (!webSite.h1) webSite.h1 = "Titre du site";
  if (!webSite.phone) webSite.phone = "06 06 06 06 06";
  if (!webSite.googleMapsName) webSite.googleMapsName = "Artilis";
  if (!webSite.address) webSite.address = "Bordeaux, France";
  if (!webSite.aboutDescription) webSite.aboutDescription = "Description";
  if (!webSite.projectPhotos.length)
    webSite.projectPhotos = [
      "https://placehold.co/400x400?text=Photo+1",
      "https://placehold.co/400x400?text=Photo+2",
      "https://placehold.co/400x400?text=Photo+3",
      "https://placehold.co/400x400?text=Photo+4",
      "https://placehold.co/400x400?text=Photo+5",
      "https://placehold.co/400x400?text=Photo+6",
    ];

  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const inputRef = useRef(null);
  const [ratingInfos, setRatingInfos] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const service = new google.maps.places.PlacesService(inputRef.current);
    service.findPlaceFromQuery(
      {
        query: webSite.googleMapsName,
        fields: ["place_id", "geometry.location"],
      },
      (results, status) => {
        if (status === "OK") {
          service.getDetails(
            {
              placeId: results[0].place_id,
              fields: ["rating", "reviews", "user_ratings_total", "geometry"],
            },
            (place, status) => {
              if (status === "OK") {
                setCoordinates({
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                });
                setRatingInfos({
                  rating: place.rating,
                  reviews: place.reviews,
                  total: place.user_ratings_total,
                });
              }
            },
          );
        }
      },
    );
  }, []);

  const handleSendEmail = async () => {
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        body: JSON.stringify({
          subject: "Une personne vous a contacté depuis votre site internet",
          email: values.email,
          toEmail: webSite.email,
          message:
            "Email : " +
            values.email +
            "\n" +
            "Nom : " +
            values.name +
            "\n" +
            "Téléphone : " +
            values.tel +
            "\n" +
            "Message :\n" +
            values.message,
        }),
      });
      const data = await res.json();
      form.resetFields();
      message.success("Votre message a bien été envoyé");
    } catch (error) {
      message.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  return (
    <HomeWrapper>
      <input
        ref={inputRef}
        style={{ display: "none" }}
        value={webSite.googleMapsName}
        onChange={() => {}}
      />
      <div
        className="banner"
        id="accueil"
        style={{
          backgroundImage: `url(${webSite.bannerPhoto})`,
        }}
      />
      <div className="banner-inner">
        <h1>{webSite.h1}</h1>
        <Button onClick={() => setIsModalVisible(true)}>
          Demander un devis
        </Button>
        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            size="large"
            onFinish={handleSendEmail}
          >
            <Form.Item
              label="Nom"
              name={["name"]}
              required
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="E-mail"
              name={["email"]}
              required
              rules={[
                {
                  required: true,
                },
                {
                  validator: (rule, value) => {
                    if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                      return Promise.reject("Veuillez saisir un e-mail valide");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Téléphone"
              name={["tel"]}
              required
              rules={[
                {
                  required: true,
                },
                {
                  validator: (rule, value) => {
                    if (!value.match(/^0[1-9]([-. ]?[0-9]{2}){4}$/g)) {
                      return Promise.reject(
                        "Veuillez saisir un téléphone valide",
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="tel" />
            </Form.Item>
            <Form.Item
              label="Message"
              name={["message"]}
              required
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea />
            </Form.Item>
            <Flex justify="flex-end">
              <Form.Item>
                <Button type="primary" onClick={() => form.submit()}>
                  Demander un devis
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Modal>
        <a href={"tel:" + webSite.phone.replace(/ /g, "")}>
          <Button style={{ marginTop: 20 }} type="primary">
            {webSite.phone.replace(/(\d{2})(?=\d)/g, "$1 ")}
          </Button>
        </a>
      </div>
      <div className="services" id="services">
        <h2>{webSite.servicesTitle || "Services"}</h2>
        <Flex justify="space-around" wrap>
          {[
            {
              title: webSite.service1Title || "Service 1",
              description: webSite.service1Desc || "Description",
            },
            {
              title: webSite.service2Title || "Service 2",
              description: webSite.service2Desc || "Description",
            },
            {
              title: webSite.service3Title || "Service 3",
              description: webSite.service3Desc || "Description",
            },
          ].map((service, i) => (
            <Flex key={i}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </Flex>
          ))}
        </Flex>
      </div>
      <div className="a-propos" id="a-propos">
        {webSite.aboutPhoto ? (
          <img src={webSite.aboutPhoto} alt="a propos" />
        ) : null}
        <h2>{webSite.aboutTitle || "A propos"}</h2>
        {webSite.aboutDescription.split("\n").map((e, i) => (
          <p key={i}>{e}</p>
        ))}
      </div>
      <div className="realisations" id="realisations">
        <h2>{webSite.projectsTitle || "Réalisations"}</h2>
        <AntdImage.PreviewGroup>
          <Carousel slidesToShow={isMobile ? 1 : 3} arrows infinite={false}>
            {webSite.projectPhotos.map((e, i) => (
              <div key={i}>
                <AntdImage src={e} alt={"Réalisations " + (i + 1)} />
              </div>
            ))}
          </Carousel>
        </AntdImage.PreviewGroup>
      </div>
      {ratingInfos && (
        <div className="reviews" id="avis">
          <div className="globals">
            <h2>{webSite.reviewsTitle || "Avis"}</h2>
            <Flex align="center" className="rating">
              <Rate allowHalf value={ratingInfos.rating} disabled />
              <p>{ratingInfos.rating} / 5</p>
              <p style={{ marginLeft: 10 }}>
                <i>({ratingInfos.total} avis)</i>
              </p>
            </Flex>
          </div>
          <Flex justify="center" align="flex-start" className="reviews" wrap>
            {(ratingInfos.reviews ?? [])
              .filter((review) => review.rating > 3)
              .map((review) => (
                <div key={review.time}>
                  <p>
                    <b>{review.author_name}</b>
                  </p>
                  <Rate allowHalf value={review.rating} disabled />
                  <p>{review.text}</p>
                </div>
              ))}
          </Flex>
        </div>
      )}
      <Flex className="contact" id="contact">
        <Flex flex={1}>
          <img
            src={webSite.contactPhoto}
            alt="contact"
            style={{ backgroundColor: "black" }}
          />
          <div>
            <h2>Contact</h2>
            <Flex align="center">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <a href={webSite.googleMapsLink} target="_blank" rel="noreferrer">
                <p>{webSite.address}</p>
              </a>
            </Flex>
            {webSite.email && (
              <Flex align="center">
                <FontAwesomeIcon icon={faAt} />
                <a
                  href={"mailto:" + webSite.email}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>{webSite.email}</p>
                </a>
              </Flex>
            )}
            <Flex align="center">
              <FontAwesomeIcon icon={faPhone} />
              <a href={"tel:" + webSite.phone.replace(/ /g, "")}>
                <p>{webSite.phone.replace(/(\d{2})(?=\d)/g, "$1 ")}</p>
              </a>
            </Flex>
            {webSite.facebookLink && (
              <Flex align="center">
                <FontAwesomeIcon icon={faFacebook} />
                <a href="" target="_blank">
                  <p>Suivez-nous sur Facebook</p>
                </a>
              </Flex>
            )}
            {webSite.instagramLink && (
              <Flex align="center">
                <FontAwesomeIcon icon={faInstagram} />
                <a href="" target="_blank">
                  <p>Suivez-nous sur Instagram</p>
                </a>
              </Flex>
            )}
          </div>
        </Flex>
        <Flex flex={1} vertical>
          <Form
            form={form}
            layout="vertical"
            size="large"
            onFinish={handleSendEmail}
          >
            <Form.Item
              label="Nom"
              name={["name"]}
              required
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="E-mail"
              name={["email"]}
              required
              rules={[
                {
                  required: true,
                },
                {
                  validator: (rule, value) => {
                    if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                      return Promise.reject("Veuillez saisir un e-mail valide");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Téléphone"
              name={["phone"]}
              required
              rules={[
                {
                  required: true,
                },
                {
                  validator: (rule, value) => {
                    if (!value.match(/^0[1-9]([-. ]?[0-9]{2}){4}$/g)) {
                      return Promise.reject(
                        "Veuillez saisir un téléphone valide",
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="tel" />
            </Form.Item>
            <Form.Item
              label="Message"
              name={["message"]}
              required
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea />
            </Form.Item>
            <Flex justify="flex-end">
              <Form.Item>
                <Button type="primary" onClick={() => form.submit()}>
                  Envoyer
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Flex>
      </Flex>
      <div className="map" id="localisation">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "600px",
          }}
          center={coordinates}
          zoom={10}
          options={{
            zoomControl: true,
            tilt: 0,
            gestureHandling: "auto",
            mapTypeId: "roadmap",
          }}
        >
          {coordinates && <Marker position={coordinates} />}
        </GoogleMap>
      </div>
    </HomeWrapper>
  );
};

export default Home;
