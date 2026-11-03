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
import { useIsGoogleLoaded } from "@/providers/GoogleProvider";
import Link from "next/link";
import { minimumServices } from "@/lib/services";
import { buildLocalPageTitle, buildServicePageHref } from "@/lib/localPages";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Home = ({ webSite, currentCity = null, currentService = null }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1300;

  if (!webSite.h1) webSite.h1 = "Titre du site";
  if (!webSite.phone) webSite.phone = "06 06 06 06 06";
  if (!webSite.googleMapsName) webSite.googleMapsName = "Artilis";
  if (!webSite.address) webSite.address = "Bordeaux, France";
  if (!webSite.aboutDescription) webSite.aboutDescription = "Description";
  const projectPhotos = webSite.photos?.projects?.length
    ? webSite.photos.projects
    : (webSite.projectPhotos ?? []).map((url) => ({ url }));
  const displayedProjectPhotos = projectPhotos.length
    ? projectPhotos
    : [1, 2, 3, 4, 5, 6].map((number) => ({
        url: `https://placehold.co/400x400?text=Photo+${number}`,
      }));

  const localPageTitle =
    currentCity || currentService
      ? buildLocalPageTitle({ webSite, city: currentCity, service: currentService })
      : null;
  const displayedServices = [
    ...(webSite.services ?? []),
    ...Array.from(
      { length: Math.max(0, minimumServices - (webSite.services ?? []).length) },
      (_, i) => ({
        title: "Service " + ((webSite.services ?? []).length + i + 1),
        homeDescription: "Description",
      }),
    ),
  ];

  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const isGoogleLoaded = useIsGoogleLoaded();
  const inputRef = useRef(null);
  const [ratingInfos, setRatingInfos] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!isGoogleLoaded) return;
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
  }, [isGoogleLoaded]);

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
        <h1>{localPageTitle || webSite.h1}</h1>
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
          {displayedServices.map((service, i) => {
            const servicePhoto = service.photos?.[0];
            const card = (
              <Flex
                key={service.slug ?? i}
                className={servicePhoto ? "has-photo" : undefined}
              >
                {servicePhoto ? (
                  <img src={servicePhoto.url} alt={servicePhoto.alt || service.title} />
                ) : null}
                <h3>{service.title}</h3>
                {service.homeDescription ? <p>{service.homeDescription}</p> : null}
              </Flex>
            );
            return service.slug ? (
              <Link
                key={service.slug}
                href={buildServicePageHref(webSite, service)}
                style={{ display: "contents" }}
              >
                {card}
              </Link>
            ) : (
              card
            );
          })}
        </Flex>
      </div>
      {localPageTitle ? (
        <div className="a-propos" id="page-locale">
          <h2>{localPageTitle}</h2>
          {currentCity?.description
            ? currentCity.description
                .split("\n")
                .map((line, i) => <p key={i}>{line}</p>)
            : null}
          {currentService?.pageDescription ? (
            <div
              dangerouslySetInnerHTML={{ __html: currentService.pageDescription }}
            />
          ) : null}
          {currentService?.photos?.length ? (
            <AntdImage.PreviewGroup>
              <Flex wrap gap={10} justify="center">
                {currentService.photos.map((servicePhoto, i) => (
                  <AntdImage
                    key={servicePhoto.url}
                    src={servicePhoto.url}
                    alt={servicePhoto.alt || currentService.title + " " + (i + 1)}
                    width={300}
                  />
                ))}
              </Flex>
            </AntdImage.PreviewGroup>
          ) : null}
        </div>
      ) : null}
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
            {displayedProjectPhotos.map((projectPhoto, i) => (
              <div key={i}>
                <AntdImage
                  src={projectPhoto.url}
                  alt={projectPhoto.alt || "Réalisations " + (i + 1)}
                />
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
        {isGoogleLoaded && (
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
        )}
      </div>
    </HomeWrapper>
  );
};

export default Home;
