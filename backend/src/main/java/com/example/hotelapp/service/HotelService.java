package com.example.hotelapp.service;

import com.example.hotelapp.dto.HotelDTO;
import com.example.hotelapp.model.Hotel;
import com.example.hotelapp.model.Location;
import com.example.hotelapp.repository.HotelRepository;
import com.example.hotelapp.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final HotelRepository hotelRepository;
    private final LocationRepository locationRepository;

    public List<HotelDTO> getAll(){
        List<Hotel> hotelsFromDatabase = hotelRepository.findAll();

        List<HotelDTO> dtoList = new ArrayList<>();

        for(Hotel hotel : hotelsFromDatabase){
            HotelDTO dto = mapToDto(hotel);
            dtoList.add(dto);
        }
        return dtoList;
    }

    public HotelDTO create(HotelDTO hotelDTO){
        Location location = locationRepository.findById(hotelDTO.getLocationId()).
                orElseThrow(()-> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono lokalizacji o podanym ID"));

        Hotel hotelToSave = mapToEntity(hotelDTO);

        hotelToSave.setLocation(location);

        Hotel saveHotel = hotelRepository.save(hotelToSave);

        return mapToDto(saveHotel);
    }

    public HotelDTO update(Long id, HotelDTO hotelDTO){
        Hotel existingHotel = hotelRepository.findById(id).
                orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Nie znaleziono hotelu o podanym ID"));

        Location newLocation = locationRepository.findById(hotelDTO.getLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie istnieje lokalizacja o ID"));

        existingHotel.setName(hotelDTO.getName());
        existingHotel.setDescription(hotelDTO.getDescription());
        existingHotel.setStars(hotelDTO.getStars());
        existingHotel.setPhone(hotelDTO.getPhone());
        existingHotel.setEmail(hotelDTO.getEmail());
        existingHotel.setLocation(newLocation);

        Hotel saveHotel = hotelRepository.save(existingHotel);
        return mapToDto(saveHotel);
    }

    public void delete(Long id){
        if(hotelRepository.existsById(id)){
            hotelRepository.deleteById(id);
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie można usunąć: brak hotelu o ID");
        }
    }
    private HotelDTO mapToDto(Hotel hotel){
        HotelDTO dto = new HotelDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setDescription(hotel.getDescription());
        dto.setStars(hotel.getStars());
        dto.setPhone(hotel.getPhone());
        dto.setEmail(hotel.getEmail());

        if (hotel.getLocation() != null) {
            dto.setLocationId(hotel.getLocation().getId());
        }
        return dto;
    }
    private Hotel mapToEntity(HotelDTO dto){
        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setDescription(dto.getDescription());
        hotel.setStars(dto.getStars());
        hotel.setPhone(dto.getPhone());
        hotel.setEmail(dto.getEmail());

        return hotel;
    }
}
