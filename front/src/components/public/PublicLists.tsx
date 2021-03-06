import React, { useEffect, useState } from 'react';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import {
  List as ListIcon, Map,
} from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicLists, toggleFavorite } from '../../state/reducers/list/listActions';
import { List } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import FilterMapView from './FilterMapView';
import ListComponent from './ListComponent';
import PaginatePublicLists from './PaginatePublicLists';
import PublicListMap from './PublicListMap';
import SortAndFilterList from './SortAndFilterList';

const PublicLists: React.FC = () => {
  const publicLists = useSelector((state: RootStore) => state.lists.publicLists);
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);
  const [sortCriteria, setSortCriteria] = useState<string>('Date');
  const [sortDirection, setSortDirection] = useState<string>('desc');
  const [filteredList, setFilteredList] = useState<List[] | undefined>(publicLists);
  const [showMap, setShowMap] = useState(false);
  const [mapView, setMapView] = useState('World');
  const [listsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => { dispatch(getPublicLists()); }, [dispatch]);
  useEffect(() => {
    if (publicLists) {
      if (!countryFilter) setFilteredList(publicLists);
      else setFilteredList(publicLists.filter((l) => l.country === countryFilter));
    }
  }, [countryFilter, publicLists]);
  useEffect(() => { setCurrentPage(1); }, [countryFilter]);

  const handleToggleFavorite = (listId: string): void => { // TODO try-catch?
    dispatch(toggleFavorite(listId));
  };

  if (!filteredList || !publicLists) return null;

  const countries = Array.from(new Set(publicLists.map((l: List) => l.country)));
  countries.sort((a, b) => a.localeCompare(b));

  const indexOfLast = currentPage * listsPerPage;
  const indexOfFirst = indexOfLast - listsPerPage;
  let currentList = filteredList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(indexOfFirst, indexOfLast);

  if (sortCriteria === 'Country') {
    if (sortDirection === 'asc') {
      currentList = filteredList.sort((a, b) => b.country.localeCompare(a.country)).slice(indexOfFirst, indexOfLast);
    } else if (sortDirection === 'desc') {
      currentList = filteredList.sort((a, b) => a.country.localeCompare(b.country)).slice(indexOfFirst, indexOfLast);
    }
  } else if (sortCriteria === 'Comments') {
    if (sortDirection === 'asc') {
      currentList = filteredList.sort((a, b) => a.comments.length - b.comments.length).slice(indexOfFirst, indexOfLast);
    } else if (sortDirection === 'desc') {
      currentList = filteredList.sort((a, b) => b.comments.length - a.comments.length).slice(indexOfFirst, indexOfLast);
    }
  } else if (sortCriteria === 'Date') {
    if (sortDirection === 'asc') {
      currentList = filteredList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(indexOfFirst, indexOfLast);
    } else if (sortDirection === 'desc') {
      currentList = filteredList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(indexOfFirst, indexOfLast);
    }
  } else if (sortCriteria === 'Favorited') {
    if (sortDirection === 'asc') {
      currentList = filteredList.sort((a, b) => a.favoritedBy.length - b.favoritedBy.length).slice(indexOfFirst, indexOfLast);
    } else if (sortDirection === 'desc') {
      currentList = filteredList.sort((a, b) => b.favoritedBy.length - a.favoritedBy.length).slice(indexOfFirst, indexOfLast);
    }
  } else if (sortCriteria === 'Name') {
    if (sortDirection === 'asc') {
      currentList = filteredList.sort((a, b) => b.name.localeCompare(a.name)).slice(indexOfFirst, indexOfLast);
    } else if (sortDirection === 'desc') {
      currentList = filteredList.sort((a, b) => a.name.localeCompare(b.name)).slice(indexOfFirst, indexOfLast);
    }
  }

  return (
    <>
      <Container className="mt-5">
        <h4>Public location lists</h4>
        <Col>
          <Row>
            <Button
              variant="outline-secondary"
              size="sm"
              className="m-1"
              onClick={(): void => {
                setShowMap(!showMap);
                setCountryFilter(undefined);
                setCurrentPage(1);
              }}
            >
              {showMap
                ? (
                  <>
                    <ListIcon size={20} style={{ marginRight: '5px' }} />
                    View as list
                  </>
                )
                : (
                  <>
                    <Map size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
                    View on map
                  </>
                )}
            </Button>
            {showMap
              ? <FilterMapView publicLists={publicLists} setMapView={setMapView} />
              : (
                <SortAndFilterList
                  countries={countries}
                  setCountryFilter={setCountryFilter}
                  sortCriteria={sortCriteria}
                  setSortCriteria={setSortCriteria}
                  setSortDirection={setSortDirection}
                  sortDirection={sortDirection}
                  setCurrentPage={setCurrentPage}
                />
              )}
          </Row>
        </Col>
      </Container>
      <hr />
      {
        showMap
          ? (
            <div className="no-gutter-div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PublicListMap lists={filteredList} mapView={mapView} />
            </div>
          )
          : (
            <>
              {currentList && currentList.map((list) => (
                <ListComponent list={list} key={list._id} toggleFavorite={handleToggleFavorite} fromWhere="public" />
              ))}
              {listsPerPage <= filteredList.length
                && (
                  <PaginatePublicLists
                    perPage={listsPerPage}
                    total={filteredList.length}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                )}
            </>
          )
      }
    </>
  );
};
export default PublicLists;
