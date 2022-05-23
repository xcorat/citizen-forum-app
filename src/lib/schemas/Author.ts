export default class Author {
    uuid: string;
    name: string;
    // DigIds: the first ID is the default, but keep the ability to add more
    dig_ids: {
        type: string;
        id: string;
    }[];

    get main_id() { return this.dig_ids[0]; }

    constructor(author) {
        this.uuid = author.uuid;
        this.name = author.name;
        if(!this.name) throw TypeError("Cannot find property name.")
        if(Array.isArray(author.dig_ids)){
            this.dig_ids = author.dig_ids.map(dig_id => ({type: dig_id.type, id: dig_id.id}) )
        }
        else if('dig_id' in author){
            this.dig_ids = [ {type: author.dig_id.type, id: author.dig_id.id} ];
        }
        //TODO: Maybe check for a dictionary of digita Ids too, if needed
        else {
            // Digital id is required
            throw TypeError("Digital Id of the author is required.")
        }
    }

    static anon(){
        return new this({
            uuid: null, // add the userId of actual anon user
            name: 'Anonymous',
            dig_ids: [{
                type: null,
                id: ''
            }]
        })
    }

}