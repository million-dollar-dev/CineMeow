package com.cinemeow.cinema_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "cinemas")
public class Cinema {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "address", nullable = false)
    String address;

    @Column(name = "city")
    String city;

    @ManyToOne
    CinemaBrand brand;

    @Column(name = "image_url")
    String imageUrl;

    @OneToMany(
            mappedBy = "cinema",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    List<Room> rooms = new ArrayList<>();
}
